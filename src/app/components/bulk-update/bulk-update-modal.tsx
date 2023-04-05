import React, {Fragment, useEffect, useMemo, useReducer, useState} from 'react';
import {
    SyntheticMonitor,
} from '@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/synthetic-monitor';
import {syntheticMonitorsClient} from '@dynatrace-sdk/client-classic-environment-v1';
import {Button, Flex, LoadingIndicator, Modal, OverlayContainer, Text} from '@dynatrace/strato-components-preview';
import {ParameterUpdateSection} from './parameter-update-section';
import {getInitialBulkConfig} from '../../utils/display';
import {
    BulkConfig,
    ConfigParam,
    ConfigParamChangeAction,
    DisplayMode,
    InitialBulkConfig,
    UpdateState,
} from '../../utils/models';
import {UpdateProgressAndResult} from './update-progress-and-result';
import {getUpdateDto, getUpdateDtoForCurrentSelection} from '../../utils/update';
import {empty} from '../../utils/constants';
import {Switch} from '@dynatrace/strato-components-preview/forms';

const commonConfigParameters: ConfigParam[] = [
  ConfigParam.OUTAGE_HANDLING,
  ConfigParam.LOCATIONS,
  ConfigParam.TAGS,
];

const allConfigParameters: ConfigParam[] = [
  ...commonConfigParameters,
  ConfigParam.FREQUENCY,
  ConfigParam.MANUALLY_ASSIGNED_APPS,
];

const updateParamStateReducer: (state: BulkConfig, action: ConfigParamChangeAction) => BulkConfig =
  (state, action) => {
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
            globalOutage: action.updatedValue.outageHandling?.globalOutage ?? empty,
            globalOutagePolicy: {
              consecutiveRuns: action.updatedValue.outageHandling?.globalOutagePolicy.consecutiveRuns ?? empty,
            },
          },
        };
      case ConfigParam.TAGS:
        return {
          ...state,
          tags: action.updatedValue.tags,
        };
      default:
        return {...state};
    }
  };

export const BulkUpdateModal = ({ selectedIds, showFormHandler, setSelectedForPreview }: { selectedIds: string[], showFormHandler: (boolean) => void, setSelectedForPreview: (id: string | null) => void }): JSX.Element => {

  const [fetchedConfigs, setFetchedConfigs] = useState<SyntheticMonitor[]>([]);
  const [selectedParam, setSelectedParam] = useState<ConfigParam[] | null>([ConfigParam.OUTAGE_HANDLING]);
  const [saveCurrentOnly, setSaveCurrentOnly] = useState<boolean>(false);
  const [updatedBulkConfig, dispatchParamChange] = useReducer(updateParamStateReducer, {});
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [updateState, setUpdateState] = useState<UpdateState>({ progressCounter: 0, success: false, completed: false });
  const [fetchError, setFetchError] = useState<string | null>(null);

  const currentMode = useMemo<DisplayMode>(() => {
    const httpMonitorCount = selectedIds.filter(id => id.startsWith('HTTP_CHECK')).length;
    return httpMonitorCount === selectedIds.length || httpMonitorCount === 0 ?
      DisplayMode.SAME_TYPE : DisplayMode.MIXED;
  }, [selectedIds]);

  const availableConfigParameters = useMemo<ConfigParam[]>(() => {
    return currentMode === DisplayMode.SAME_TYPE ? allConfigParameters : commonConfigParameters;
  }, [currentMode]);

  const initialBulkConfig = useMemo<InitialBulkConfig | undefined>(() => {
    return fetchedConfigs.length > 0 ? getInitialBulkConfig(fetchedConfigs) : undefined;
  }, [fetchedConfigs]);

  /** fetching selected monitor configurations for update */
  useEffect(() => {
    const abortController = new AbortController();
    if (selectedIds.length > 0) {
      const requests: Promise<SyntheticMonitor>[] = selectedIds.map(
        (id: string) => syntheticMonitorsClient.getMonitor({ monitorId: id, abortSignal: abortController.signal })
      );
      Promise.all(requests)
        .then((configs: SyntheticMonitor[]) => {
          setFetchError(null);
          setFetchedConfigs(configs);
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            setFetchError(error.message);
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [selectedIds]);

  /** saving updated configurations */
  const saveUpdateHandler = () => {
    setShowProgressModal(true);
    if (!initialBulkConfig) {
      return;
    }
    const requests: Promise<void>[] = fetchedConfigs.map(config => {
      const updatedConfig = saveCurrentOnly ?
        getUpdateDtoForCurrentSelection(config, initialBulkConfig, updatedBulkConfig, selectedParam?.[0]) :
        getUpdateDto(config, initialBulkConfig, updatedBulkConfig, currentMode);
      return syntheticMonitorsClient.replaceMonitor({ body: updatedConfig, monitorId: config.entityId })
        .finally(() => {
          setUpdateState((prevState) => {
            return {
              ...prevState,
              progressCounter: prevState.progressCounter + 1,
            }
          });
        });
    });
    Promise.allSettled(requests)
      .then(results => {
        const rejected = results.find(res => res.status === 'rejected');
        setUpdateState((prevState) => {
          return {
            ...prevState,
            completed: true,
            success: !rejected,
            error: rejected ? (rejected as PromiseRejectedResult).reason.message : undefined,
          }
        });
      });
  };

  const dismissHandler = () => {
    setShowProgressModal(false);
    showFormHandler(false);
    setSelectedForPreview(null);
  }
  const footer = (updateState.completed &&
      <Button data-testid="close-modal-button" variant={"primary"} onClick={dismissHandler}>
        Close
      </Button>
  );

  return (
      <>
        {!showProgressModal && (
            <Flex flexDirection="column" gap={16}>
              {!initialBulkConfig && (<LoadingIndicator loading={!initialBulkConfig && !fetchError}/>)}
              {fetchError && (
                  <Fragment>
                    <Text>Error: Could not fetch the requested configurations.</Text>
                    <Text>{fetchError}</Text>
                  </Fragment>
              )}
              {initialBulkConfig && (
                  <Fragment>
                      <Switch name="update-scope" value={saveCurrentOnly} onChange={setSaveCurrentOnly}>
                          Save changes to the currently selected parameter only
                      </Switch>
                      <ParameterUpdateSection
                          availableConfigParameters={availableConfigParameters}
                          selectedParam={selectedParam}
                          setSelectedParam={setSelectedParam}
                          dispatchParamChangeFn={dispatchParamChange}
                          initialBulkConfig={initialBulkConfig}
                          updatedBulkConfig={updatedBulkConfig}
                      />
                      <Flex flexDirection="row" justifyContent="flex-start">
                          <Button variant="primary" onClick={saveUpdateHandler}>
                              Update
                          </Button>
                          <Button variant="minimal"  onClick={() => {dismissHandler()}}>
                              Cancel
                          </Button>
                      </Flex>
                  </Fragment>
              )}
            </Flex>)}
        <OverlayContainer>
          <Modal title={updateState.completed ? "Done." : "Please wait..."}
                 dismissible={false}
                 show={showProgressModal}
                 onDismiss={dismissHandler}
                 footer={footer}
                 size={"small"}
          >
            <UpdateProgressAndResult updateState={updateState} requestCount={fetchedConfigs.length}/>
          </Modal>
        </OverlayContainer>
      </>
  );
}