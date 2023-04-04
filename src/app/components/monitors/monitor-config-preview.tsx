import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {CodeEditor} from '@dynatrace/strato-components-preview/editors';
import {Flex, LoadingIndicator} from '@dynatrace/strato-components-preview';
import {syntheticMonitorsClient} from '@dynatrace-sdk/client-classic-environment-v1';
import {
  SyntheticMonitor,
} from '@dynatrace-sdk/client-classic-environment-v1/types/packages/client/classic-environment-v1/src/lib/models/synthetic-monitor';
import {Text} from '@dynatrace/strato-components-preview/typography';

export const MonitorConfigPreview = ({ monitorId, height }: { monitorId: string | null , height: number}): JSX.Element => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [configAsString, setConfigAsString] = useState<string>('');

  /** fetching full monitor configuration details for preview */
  const fetchIdRef = useRef(0);
  const fetchMonitorConfig = useCallback(() => {
    if (monitorId !== null) {
      setIsLoading(true);
      const fetchId = ++fetchIdRef.current;
      if (fetchId === fetchIdRef.current) {
        syntheticMonitorsClient.getMonitor({ monitorId })
          .then((response: SyntheticMonitor) => {
            if (fetchId === fetchIdRef.current) {
              setConfigAsString('');
              setTimeout(() => {
                setConfigAsString(JSON.stringify(response, undefined, 2));
                setIsLoading(false);
              }, 0);
            }
          })
          .catch(() => {
            setConfigAsString('');
          });
      }
    } else {
      setConfigAsString('');
    }
  }, [monitorId]);

  useEffect(() => {
    fetchMonitorConfig();
  }, [fetchMonitorConfig]);

  return (
    (<Fragment>
      <LoadingIndicator loading={isLoading} />
      <Flex height={height} flexDirection="column" justifyContent={"center"}>
        {(isLoading || configAsString.length > 0) && (
          <CodeEditor language="json" readOnly lineWrap fullHeight value={configAsString} />
        )}
        {!isLoading && configAsString.length === 0 && (
          <Text textStyle="default-emphasized">
            No monitor selected. Click one of the names in the list to display the configuration in JSON format here.
          </Text>
        )}
      </Flex>
    </Fragment>)
  );
}