import {
    SyntheticMonitor,
} from '@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/synthetic-monitor';
import {BulkConfig, ConfigParam, InitialBulkConfig, TagParam, ValidationResult, Wildcard} from './models';
import {empty, keyValueSeparator, wildcard} from './constants';
import {TagWithSourceInfo} from '@dynatrace-sdk/client-classic-environment-v1';

/** Helpers for displaying selected configuration parameters in the editor. */

const getCommonListItems: (itemToCount: Map<string, number>, totalCount: number) => Array<string> =
  (itemToCount, totalCount) => {
    const commonItems: string[] = [];
    let otherThanCommonItemsPresent = false;
    itemToCount.forEach((value: number, key: string) => {
      if (value === totalCount) {
        commonItems.push(key);
      } else {
        otherThanCommonItemsPresent = true;
      }
    });
    if (otherThanCommonItemsPresent) {
      commonItems.push(wildcard);
    }

    return commonItems;
  };

const updateItemsCount: (items: Array<string>, itemToCount: Map<string, number>) => void =
  (items, itemToCount) => {
    items.forEach(item => {
      const currentCount = itemToCount.get(item);
      itemToCount.set(item, currentCount ? currentCount + 1 : 1);
    });
  };

const getUserTagsAsStrings: (tags: TagWithSourceInfo[]) => Array<string> =
  (tags) => {
    return tags
      .filter(tag => tag.source === 'USER')
      .map(tag => `${tag.key}${keyValueSeparator}${tag.value ?? ''}`);
  };

const stringsToTags: (tagStrings: Array<string | Wildcard>) => Array<TagParam | Wildcard> =
  (tagStrings) => {
    return tagStrings.map(str => {
      if (str !== wildcard) {
        const [key, value] = str.split(keyValueSeparator);
        return { key, value: value.length > 0 ? value : undefined };
      }
      return str;
    })
  };

/**
 * Goes through all fetched configurations and finds property values equal for all of them
 * @param fetchedConfigs Detailed configurations fetched for selected monitors
 * @return A model ready for displaying in the editor
 * (with specific values where properties are equal for all selected configurations
 * and wildcard otherwise)
 */
export const getInitialBulkConfig: (fetchedConfigs: SyntheticMonitor[]) => InitialBulkConfig =
  (fetchedConfigs) => {
    let sameFrequency = true;
    let sameGlobalOutage = true;
    let sameConsecutiveRuns = true;

    const locationToCount = new Map<string, number>();
    const applicationToCount = new Map<string, number>();
    const tagToCount = new Map<string, number>();

    const baseConfig = fetchedConfigs[0];
    const baseOutageHandling = baseConfig?.anomalyDetection?.outageHandling;
    fetchedConfigs.forEach(config => {
      const outageHandling = config.anomalyDetection?.outageHandling;
      sameGlobalOutage = sameGlobalOutage && outageHandling?.globalOutage === baseOutageHandling?.globalOutage;
      sameConsecutiveRuns = sameConsecutiveRuns &&
        outageHandling?.globalOutagePolicy?.consecutiveRuns === baseOutageHandling?.globalOutagePolicy?.consecutiveRuns;
      updateItemsCount(config.locations, locationToCount);
      sameFrequency = sameFrequency && config.frequencyMin === baseConfig.frequencyMin;
      updateItemsCount(config.manuallyAssignedApps, applicationToCount);
      updateItemsCount(getUserTagsAsStrings(config.tags), tagToCount);
    });

    return {
      frequencyMin: sameFrequency ? baseConfig?.frequencyMin : wildcard,
      locations: getCommonListItems(locationToCount, fetchedConfigs.length),
      manuallyAssignedApps: getCommonListItems(applicationToCount, fetchedConfigs.length),
      outageHandling: {
        globalOutage: sameGlobalOutage ? baseOutageHandling?.globalOutage ?? empty : wildcard,
        globalOutagePolicy: {
          consecutiveRuns: sameConsecutiveRuns ? baseOutageHandling?.globalOutagePolicy?.consecutiveRuns ?? empty : wildcard,
        }
      },
      tags: stringsToTags(getCommonListItems(tagToCount, fetchedConfigs.length)),
    }
  };

const isOfType = <T extends 'string' | 'number' | 'boolean'>(value: unknown, type: T): boolean => {
  return typeof value === type;
};

const isObjectWithKey = <K extends string>(
  value: unknown, key: K
): value is Record<K, unknown> => {
  return value !== null && typeof value === 'object' && key in value;
};

const frequencyTypeValid: (value: unknown) => boolean =
  (frequencyMin) => {
    return isOfType(frequencyMin, 'number') || frequencyMin === wildcard;
  };

const outageHandlingTypesValid: (value: unknown) => boolean =
  (value) => {
    if (isObjectWithKey(value, 'globalOutage') && isObjectWithKey(value, 'globalOutagePolicy')) {
      const { globalOutage, globalOutagePolicy } = value;
      const globalOutageValid = isOfType(globalOutage, 'boolean') || globalOutage === wildcard;
      if (isObjectWithKey(globalOutagePolicy, 'consecutiveRuns')) {
        const runCount = globalOutagePolicy.consecutiveRuns;
        const consecutiveRunsValid = isOfType(runCount, 'number') || runCount === wildcard || runCount === empty;

        return globalOutageValid && consecutiveRunsValid;
      }
    }

    return false;
  };

const arrayTypesValid: (items: unknown) => boolean =
  (items) => {
    return Array.isArray(items) && items.every(id => isOfType(id, 'string'));
  };

const tagTypesValid: (items: unknown) => boolean | undefined =
  (items) => {
    return Array.isArray(items) && items.every(item => item === wildcard ||
      (isOfType(item.key, 'string') && (isOfType(item.value, 'string') || item.value === undefined))
    );
  };

/**
 * Simplified validation of a model obtained from JSON displayed in the editor.
 * Checks the presence of appropriate keys in the object and types of the entered values.
 * @param content Content displayed in the editor
 * @param actionType Selected parameter
 */
export const validateParamType: (content: string, actionType: ConfigParam) => ValidationResult =
  (content, actionType) => {
    try {
      const parsedContent = JSON.parse(content);
      if (parsedContent === null || typeof parsedContent !== 'object' || Array.isArray(parsedContent)) {
        return { error: 'Content should be a JSON object with appropriate properties.' };
      }
      switch (actionType) {
        case ConfigParam.FREQUENCY:
          return isObjectWithKey(parsedContent, 'frequencyMin') && frequencyTypeValid(parsedContent.frequencyMin) ?
            { validatedConfig: parsedContent as BulkConfig } : { error: `Frequency should be a number or "${wildcard}".` };
        case ConfigParam.OUTAGE_HANDLING:
          return isObjectWithKey(parsedContent, 'outageHandling') && outageHandlingTypesValid(parsedContent.outageHandling) ?
            { validatedConfig: parsedContent as BulkConfig } :
            { error: `Global outage should be true, false or "${wildcard}" and consecutive runs parameter 
              should be a number, "${wildcard}" or "${empty}".` };
        case ConfigParam.LOCATIONS:
          return isObjectWithKey(parsedContent, 'locations') && arrayTypesValid(parsedContent.locations) ?
            { validatedConfig: parsedContent as BulkConfig } : { error: 'All location ids should be provided as strings' };
        case ConfigParam.MANUALLY_ASSIGNED_APPS:
          return isObjectWithKey(parsedContent, 'manuallyAssignedApps') && arrayTypesValid(parsedContent.manuallyAssignedApps) ?
            { validatedConfig: parsedContent as BulkConfig } : { error: 'All application ids should be provided as strings' };
        case ConfigParam.TAGS:
          return isObjectWithKey(parsedContent, 'tags') && tagTypesValid(parsedContent.tags) ?
            { validatedConfig: parsedContent as BulkConfig } :
            { error: 'All tags should contain a string key. If a value is provided it should also be a string.' };
        default:
          return {};
      }
    } catch (error) {
      return { error: 'Could not parse JSON.' };
    }
  };
