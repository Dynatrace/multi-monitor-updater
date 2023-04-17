import React, { Fragment, useMemo, useReducer, useState } from 'react';
import { SyntheticMonitor } from '@dynatrace-sdk/client-classic-environment-v1';
import { Button, Flex, LoadingIndicator, ProgressBar, Text } from '@dynatrace/strato-components-preview';
import { ParameterUpdateSection } from './ParameterUpdateSection';
import { getInitialBulkConfig } from '../../utils/display';
import { BulkConfig, ConfigParam, ConfigParamChangeAction, InitialBulkConfig } from '../../utils/models';
import { getUpdateDto, getUpdateDtoForCurrentSelection } from '../../utils/update';
import { Switch } from '@dynatrace/strato-components-preview/forms';
import { useMonitors } from '../monitors/useMonitors';
import { progressLabel, progressVariant } from './progress-helpers';
import { useBulkUpdate } from './useBulkUpdate';

const commonConfigParameters: ConfigParam[] = [ConfigParam.OUTAGE_HANDLING, ConfigParam.LOCATIONS, ConfigParam.TAGS];

const allConfigParameters: ConfigParam[] = [
  ...commonConfigParameters,
  ConfigParam.FREQUENCY,
  ConfigParam.MANUALLY_ASSIGNED_APPS,
];

const updateParamStateReducer: (state: BulkConfig, action: ConfigParamChangeAction) => BulkConfig = (state, action) => {
  switch (action.type) {
    case ConfigParam.FREQUENCY:
      return {
        ...state,
        frequencyMin: action.updatedValue.frequencyMin,
      };
    case ConfigParam.LOCATIONS:
      return {
        ...state,
        locations: action.updatedValue.locations,
      };
    case ConfigParam.MANUALLY_ASSIGNED_APPS:
      return {
        ...state,
        applications: action.updatedValue.manuallyAssignedApps,
      };
    case ConfigParam.OUTAGE_HANDLING:
      return {
        ...state,
        outageHandling: {
          globalOutage: action.updatedValue.outageHandling?.globalOutage ?? '',
          globalOutagePolicy: {
            consecutiveRuns: action.updatedValue.outageHandling?.globalOutagePolicy.consecutiveRuns ?? '',
          },
        },
      };
    case ConfigParam.TAGS:
      return {
        ...state,
        tags: action.updatedValue.tags,
      };
    default:
      return { ...state };
  }
};

type BulkUpdateModalProps = {
  selectedIds: string[];
  onDismiss: () => void;
};

export const BulkUpdateModal = ({ selectedIds, onDismiss }: BulkUpdateModalProps) => {
  const [selectedParam, setSelectedParam] = useState<ConfigParam[] | null>([ConfigParam.OUTAGE_HANDLING]);
  const [saveCurrentOnly, setSaveCurrentOnly] = useState<boolean>(false);
  const [updatedBulkConfig, dispatchParamChange] = useReducer(updateParamStateReducer, {});

  const httpMonitorCount = selectedIds.filter((id) => id.startsWith('HTTP_CHECK')).length;

  const currentMode = httpMonitorCount === selectedIds.length || httpMonitorCount === 0 ? 'same-type' : 'mixed';

  const availableConfigParameters = currentMode === 'same-type' ? allConfigParameters : commonConfigParameters;

  const results = useMonitors(selectedIds);
  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const isSuccess = results.every((result) => result.isSuccess);

  const data = results.filter((result) => result.data !== undefined).map((result) => result.data as SyntheticMonitor);

  const initialBulkConfig = useMemo<InitialBulkConfig | undefined>(() => {
    return data.length > 0 && isSuccess ? getInitialBulkConfig(data) : undefined;
  }, [data, isSuccess]);

  const { mutate, progress, status: updateStatus } = useBulkUpdate();

  /** saving updated configurations */
  const saveUpdateHandler = () => {
    if (!initialBulkConfig) {
      return;
    }
    const updates = data.map((config) => {
      const updatedConfig = saveCurrentOnly
        ? getUpdateDtoForCurrentSelection(config, initialBulkConfig, updatedBulkConfig, selectedParam?.[0])
        : getUpdateDto(config, initialBulkConfig, updatedBulkConfig, currentMode);

      return { updatedConfig, monitorId: config.entityId };
    });
    mutate(updates);
  };

  return initialBulkConfig ? (
    <Fragment>
      {!initialBulkConfig && <LoadingIndicator loading={isLoading} />}
      {isError && <Text>Error: Could not fetch the requested configurations.</Text>}
      <Switch name='update-scope' value={saveCurrentOnly} onChange={setSaveCurrentOnly}>
        Save changes to the currently selected parameter only
      </Switch>
      <ParameterUpdateSection
        availableConfigParameters={availableConfigParameters}
        selectedParam={selectedParam}
        onSelectedParamChange={setSelectedParam}
        dispatchParamChangeFn={dispatchParamChange}
        initialBulkConfig={initialBulkConfig}
        updatedBulkConfig={updatedBulkConfig}
      />
      {updateStatus !== 'idle' ? (
        <ProgressBar value={progress} max={1} variant={progressVariant(updateStatus)}>
          <ProgressBar.Label>{progressLabel(updateStatus)}</ProgressBar.Label>
          <ProgressBar.Value>
            {data.length} / {selectedIds.length}
          </ProgressBar.Value>
        </ProgressBar>
      ) : null}
      <Flex flexDirection='row' justifyContent='flex-start'>
        {updateStatus === 'success' || updateStatus === 'error' ? (
          <Button data-testid='close-modal-button' color='primary' onClick={onDismiss}>
            Close
          </Button>
        ) : (
          <>
            <Button color='primary' disabled={!isSuccess || updateStatus === 'loading'} onClick={saveUpdateHandler}>
              Update
            </Button>
            <Button color='neutral' onClick={onDismiss}>
              Cancel
            </Button>
          </>
        )}
      </Flex>
    </Fragment>
  ) : null;
};
