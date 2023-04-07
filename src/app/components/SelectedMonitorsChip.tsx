import React from "react";
import { Text } from "@dynatrace/strato-components-preview";

type SelectedMonitorChipProps = {
  monitors: string[];
};

export const SelectedMonitorsChip = (props: SelectedMonitorChipProps) => {
  const { monitors } = props;

  const monitorsLabel = monitors.length === 1 ? "monitor" : "monitors";

  return (
    <Text textStyle="base-emphasized">
      {monitors.length === 0 ? "No" : monitors.length} {monitorsLabel} selected
    </Text>
  );
};
