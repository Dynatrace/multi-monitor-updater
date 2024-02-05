import React from 'react';
import { Container, Text } from '@dynatrace/strato-components-preview';
import { FormattedMessage } from 'react-intl';

type SelectedMonitorChipProps = {
  monitors: string[];
};

export const SelectedMonitorsChip = (props: SelectedMonitorChipProps) => {
  const { monitors } = props;

  return (
    <Container paddingY={4} paddingX={8} variant='emphasized'>
      <Text textStyle='base-emphasized'>
        <FormattedMessage
          defaultMessage='{count, plural, =0 {No monitors} one {# monitor} other {# monitors}} selected'
          id="+HdQGw8X17/urqVB"
          values={{ count: monitors.length }}
        />
      </Text>
    </Container>
  );
};
