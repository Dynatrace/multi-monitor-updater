import { SyntheticMonitor } from '@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/synthetic-monitor';
import { SyntheticMonitorUpdate } from '@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/synthetic-monitor-update';
import {
  AnomalyDetection,
  BrowserSyntheticMonitor,
  SyntheticMonitorType,
  SyntheticMonitorUpdateType,
  TagWithSourceInfo,
  TagWithSourceInfoContext,
  TagWithSourceInfoSource,
} from '@dynatrace-sdk/client-classic-environment-v1';
import { BrowserSyntheticMonitorUpdate } from '@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/browser-synthetic-monitor-update';
import { keyValueSeparator, wildcard } from './constants';
import {
  BulkConfig,
  ConfigParam,
  DisplayMode,
  InitialBulkConfig,
  OutageHandlingParam,
  TagParam,
  Wildcard,
} from './models';

/** Helpers for preparing a configuration to be sent for update. */

const createUpdateDto: (config: SyntheticMonitor) => SyntheticMonitorUpdate = (config) => {
  const updateDto: SyntheticMonitorUpdate = {
    enabled: config.enabled,
    frequencyMin: config.frequencyMin,
    locations: [...config.locations],
    manuallyAssignedApps: [...config.manuallyAssignedApps],
    name: config.name,
    script: { ...config.script },
    anomalyDetection: config.anomalyDetection ? { ...config.anomalyDetection } : undefined,
    tags: [...config.tags],
    type:
      config.type === SyntheticMonitorType.Http ? SyntheticMonitorUpdateType.Http : SyntheticMonitorUpdateType.Browser,
  };
  if (config.type === SyntheticMonitorType.Browser) {
    const browserConfig = config as BrowserSyntheticMonitor;
    (updateDto as BrowserSyntheticMonitorUpdate).keyPerformanceMetrics = browserConfig.keyPerformanceMetrics
      ? { ...browserConfig.keyPerformanceMetrics }
      : undefined;
  }

  return updateDto;
};

const getUpdatedList: (
  existing: Array<string>,
  initial: Array<string>,
  changed: Array<string> | undefined,
) => Array<string> = (existing, initial, changed) => {
  if (!changed) {
    return existing;
  }
  const preserveNonCommonItems = changed.includes(wildcard);
  if (!preserveNonCommonItems) {
    return changed;
  }
  const existingAndUpdated = existing.concat(changed);
  const existingAndUpdatedNoDuplicates = new Set(existingAndUpdated);
  existingAndUpdatedNoDuplicates.delete(wildcard);
  initial
    .filter((item) => {
      return item !== wildcard && !changed.includes(item);
    })
    .forEach((item) => {
      existingAndUpdatedNoDuplicates.delete(item);
    });

  return [...existingAndUpdatedNoDuplicates];
};

const tagToTagWithSource: (tag: TagParam) => TagWithSourceInfo = (tag) => {
  return {
    source: TagWithSourceInfoSource.User,
    context: TagWithSourceInfoContext.Contextless,
    key: tag.key,
    value: tag.value,
  };
};

const tagToString: (tag: TagParam | Wildcard) => string = (tag) => {
  return tag === wildcard ? tag : `${tag.key}${keyValueSeparator}${tag.value ?? ''}`;
};

const getUpdatedTags: (
  existing: Array<TagWithSourceInfo>,
  initial: Array<TagParam | Wildcard>,
  changed: Array<TagParam | Wildcard> | undefined,
) => Array<TagWithSourceInfo> = (existing, initial, changed) => {
  if (!changed) {
    return existing;
  }
  const existingAutoTags = existing.filter((tag) => tag.source === TagWithSourceInfoSource.RuleBased);
  const existingUserTags = existing.filter((tag) => tag.source === TagWithSourceInfoSource.User);
  const updatedList = getUpdatedList(
    existingUserTags.map(tagToString),
    initial.map(tagToString),
    changed.map(tagToString),
  );

  return existingAutoTags.concat(
    updatedList.map((tag) => {
      const [key, value] = tag.split(keyValueSeparator);
      return tagToTagWithSource({
        key,
        value: value.length > 0 ? value : undefined,
      });
    }),
  );
};

const getBasicAnomalyDetection: () => AnomalyDetection = () => {
  return {
    outageHandling: {
      globalOutage: false,
      localOutage: false,
      localOutagePolicy: {
        affectedLocations: 1,
        consecutiveRuns: 1,
      },
    },
    loadingTimeThresholds: {
      enabled: true,
      thresholds: [],
    },
  };
};

const getUpdatedAnomalyDetection: (
  existing: AnomalyDetection | undefined,
  changed: OutageHandlingParam | undefined,
) => AnomalyDetection | undefined = (existing, changed) => {
  if (!changed) {
    return existing;
  }
  const anomalyDetection = existing ? { ...existing } : getBasicAnomalyDetection();
  if (typeof changed.globalOutage === 'boolean') {
    anomalyDetection.outageHandling.globalOutage = changed.globalOutage;
  }
  if (typeof changed.globalOutagePolicy.consecutiveRuns === 'number') {
    anomalyDetection.outageHandling.globalOutagePolicy = {
      consecutiveRuns: changed.globalOutagePolicy.consecutiveRuns,
    };
  }

  return anomalyDetection;
};

/**
 * Prepares update DTO for a single configuration to be sent to API - update all changed parameters variant
 * @param existing Current single monitor configuration
 * @param initial Initial bulk configuration for all selected monitors
 * @param changed Bulk configuration with modifications made by user
 * @param mode Display mode (all monitors of the same type or mixed types)
 */
export const getUpdateDto: (
  existing: SyntheticMonitor,
  initial: InitialBulkConfig,
  changed: BulkConfig,
  mode: DisplayMode,
) => SyntheticMonitorUpdate = (existing, initial, changed, mode) => {
  const updateDto = createUpdateDto(existing);
  updateDto.locations = getUpdatedList(existing.locations, initial.locations, changed.locations);
  updateDto.anomalyDetection = getUpdatedAnomalyDetection(existing.anomalyDetection, changed.outageHandling);
  updateDto.tags = getUpdatedTags(existing.tags, initial.tags, changed.tags);
  if (mode === 'same-type') {
    updateDto.frequencyMin = typeof changed.frequencyMin === 'number' ? changed.frequencyMin : updateDto.frequencyMin;
    updateDto.manuallyAssignedApps = getUpdatedList(
      existing.manuallyAssignedApps,
      initial.manuallyAssignedApps,
      changed.manuallyAssignedApps,
    );
  }

  return updateDto;
};

/**
 * Prepares update DTO for a single configuration to be sent to API - update currently selected parameter only variant
 * @param existing Current single monitor configuration
 * @param initial Initial bulk configuration for all selected monitors
 * @param changed Bulk configuration with modifications made by user
 * @param selectedParam Parameter selected for update
 */
export const getUpdateDtoForCurrentSelection: (
  existing: SyntheticMonitor,
  initial: InitialBulkConfig,
  changed: BulkConfig,
  selectedParam: ConfigParam | undefined,
) => SyntheticMonitorUpdate = (existing, initial, changed, selectedParam) => {
  const updateDto = createUpdateDto(existing);
  if (!selectedParam) {
    return updateDto;
  }
  switch (selectedParam) {
    case ConfigParam.FREQUENCY:
      updateDto.frequencyMin = typeof changed.frequencyMin === 'number' ? changed.frequencyMin : updateDto.frequencyMin;
      break;
    case ConfigParam.LOCATIONS:
      updateDto.locations = getUpdatedList(existing.locations, initial.locations, changed.locations);
      break;
    case ConfigParam.MANUALLY_ASSIGNED_APPS:
      updateDto.manuallyAssignedApps = getUpdatedList(
        existing.manuallyAssignedApps,
        initial.manuallyAssignedApps,
        changed.manuallyAssignedApps,
      );
      break;
    case ConfigParam.OUTAGE_HANDLING:
      updateDto.anomalyDetection = getUpdatedAnomalyDetection(existing.anomalyDetection, changed.outageHandling);
      break;
    case ConfigParam.TAGS:
      updateDto.tags = getUpdatedTags(existing.tags, initial.tags, changed.tags);
      break;
    default:
      break;
  }

  return updateDto;
};
