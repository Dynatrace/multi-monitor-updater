import React, {Fragment} from 'react';
import {Flex, ProgressBar} from '@dynatrace/strato-components-preview';
import {Text} from '@dynatrace/strato-components-preview/typography';
import {UpdateState} from '../../utils/models';

export const UpdateProgressAndResult = ({ updateState, requestCount }: { updateState: UpdateState, requestCount: number }): JSX.Element => {

  return (
    (<Flex flexDirection="column" gap={8} paddingTop={20} paddingBottom={20}>
      {!updateState.completed && (
        <Fragment>
          <ProgressBar max={requestCount} value={updateState.progressCounter} />
          <Text textStyle="base-emphasized">
            In progress: {updateState.progressCounter}/{requestCount}
          </Text>
        </Fragment>
      )}
      {updateState.completed && updateState.success && (
        <Text textStyle="base-emphasized">
          Success! Updated {requestCount} configurations.
        </Text>
      )}
      {updateState.completed && !updateState.success && (
        <Fragment>
          <Text textStyle="base-emphasized">
            Error! At least one configuration was not updated.
          </Text>
          <Text>
            {updateState.error}
          </Text>
        </Fragment>
      )}
    </Flex>)
  );

}