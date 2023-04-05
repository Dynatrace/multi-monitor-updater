import React, {Fragment} from 'react';
import {List, Text} from '@dynatrace/strato-components-preview/typography';
import {ConfigParam} from '../../utils/models';
import {Flex} from '@dynatrace/strato-components-preview/layouts-core';
import Colors from '@dynatrace/strato-design-tokens/colors';
import Spacings from '@dynatrace/strato-design-tokens/spacings';
import styled from 'styled-components';
import {ExpandableText} from "@dynatrace/strato-components-preview";

const InfoBox = styled.div`
  color: ${Colors.Text.Neutral.Default};
  border: 1px solid ${Colors.Background.Field.Neutral.Emphasized};
  border-radius: 4px;
  
  padding: ${Spacings.Size8};
`;

export const ParameterUpdateDescription = ({ selectedParam }: { selectedParam: ConfigParam | undefined }): JSX.Element => {

  const isListParam: () => boolean = () => {
    return selectedParam !== ConfigParam.FREQUENCY && selectedParam !== ConfigParam.OUTAGE_HANDLING;
  }

  if (!selectedParam) {
    return <Text>No parameter selected.</Text>;
  }
  return (
    <Flex flexDirection="column" gap={4} paddingTop={4}>
      {!isListParam() && (
        <Fragment>
          <Text textStyle="small">
            If the parameter has the same value in all the selected configurations, the value is displayed.
          </Text>
          <Text textStyle="small">
            "*" indicates that the value assigned to the parameter varies across the selected configurations.
          </Text>
        </Fragment>
      )}
      {isListParam() && (
        <Fragment>
          <Text textStyle="small">
            A list of values common for all the selected configurations is displayed.
          </Text>
          <Text textStyle="small">
            "*" indicates that at least one configuration has values other than the common ones.
            <ExpandableText>
              <Text textStyle="small">
                The list can be modified as follows:
              </Text>
              <List ordered={false}>
                <Text textStyle="small">enter one or more new values to add them to all the selected configurations</Text>
                <Text textStyle="small">delete one or more of the common values to remove them from all the selected configurations</Text>
                <Text textStyle="small">delete "*" (if present) to remove from all the selected configurations any values different than the ones displayed here.</Text>
              </List>
            </ExpandableText>
          </Text>
        </Fragment>
      )}
    </Flex>
  );
}