import React from 'react';
import { Container, Text } from '@dynatrace/strato-components-preview';

type SelectedMonitorChipProps = {
  monitors: string[];
};

export const SelectedMonitorsChip = (props: SelectedMonitorChipProps) => {
  const { monitors } = props;

  const monitorsLabel = monitors.length === 1 ? 'monitor' : 'monitors';

  return (
    <Container paddingY={4} paddingX={8} variant='emphasized'>
      <Text textStyle='base-emphasized'>
        {monitors.length === 0 ? 'No' : monitors.length} {monitorsLabel} selected
      </Text>
    </Container>
  );
};
