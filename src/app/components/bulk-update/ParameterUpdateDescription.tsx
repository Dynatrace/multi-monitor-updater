import React, { Fragment } from 'react';
import { List, Text } from '@dynatrace/strato-components-preview/typography';
import { ConfigParam } from '../../utils/models';
import { Flex } from '@dynatrace/strato-components-preview/layouts-core';
import { ExpandableText } from '@dynatrace/strato-components-preview';
import { FormattedMessage } from 'react-intl';

export const ParameterUpdateDescription = ({ selectedParam }: { selectedParam: ConfigParam | undefined }) => {
  const isListParam = selectedParam !== ConfigParam.FREQUENCY && selectedParam !== ConfigParam.OUTAGE_HANDLING;

  if (!selectedParam) {
    return (
      <Text textStyle="base">
        <FormattedMessage
          defaultMessage='No parameter selected.'
          id="li8U9WH48SN+Bz87"
        />
      </Text>
    );
  }
  return (
    <Flex flexDirection='column' gap={4} paddingTop={4}>
      {!isListParam && (
        <Fragment>
          <Text textStyle='small'>
            <FormattedMessage
              defaultMessage='If the parameter has the same value in all the selected configurations, the value is displayed.'
              id="5SNwu0Ick+FEsMXX"
            />
          </Text>
          <Text textStyle='small'>
            <FormattedMessage
              defaultMessage='"*" indicates that the value assigned to the parameter varies across the selected configurations.'
              id="PyccvphLZWcoRZM5"
            />
          </Text>
        </Fragment>
      )}
      {isListParam && (
        <Fragment>
          <Text textStyle='small'>
            <FormattedMessage
              defaultMessage='A list of values common for all the selected configurations is displayed.'
              id="C2xwDeQjNqHfREGX"
            />
            </Text>
          <Text textStyle='small'>
            <FormattedMessage
              defaultMessage='"*" indicates that at least one configuration has values other than the common ones.'
              id="il8StL76jURXzPAX"
            />
            <ExpandableText>
              <Text textStyle='small'>
                <FormattedMessage
                  defaultMessage='The list can be modified as follows:'
                  id="YNFjOKOlP7E1GG4Q"
                />
              </Text>
              <List ordered={false}>
                <Text textStyle='small'>
                  <FormattedMessage
                    defaultMessage='enter one or more new values to add them to all the selected configurations'
                    id="aCqAqDaDT8/KDzhn"
                  />
                </Text>
                <Text textStyle='small'>
                  <FormattedMessage
                    defaultMessage='delete one or more of the common values to remove them from all the selected configurations'
                    id="XG8N4IwJAKfbrG/6"
                  />
                </Text>
                <Text textStyle='small'>
                  <FormattedMessage
                    defaultMessage='delete "*" (if present) to remove from all the selected configurations any values different than the
                  ones displayed here.'
                    id="K+Qn744dOS+P9lDo"
                  />
                </Text>
              </List>
            </ExpandableText>
          </Text>
        </Fragment>
      )}
    </Flex>
  );
};