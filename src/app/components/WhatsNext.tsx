import React from "react";
import {
  ExternalLink,
  Flex,
  Heading,
  Paragraph,
} from "@dynatrace/strato-components-preview";
import Colors from "@dynatrace/strato-design-tokens/colors";
import Borders from "@dynatrace/strato-design-tokens/borders";

export const WhatsNext = () => {
  return (
    <Flex
      style={{
        borderStyle: Borders.Style.Default,
        borderWidth: Borders.Width.Emphasized,
        borderRadius: Borders.Radius.Container.Default,
        borderColor: Colors.Border.Primary.Default,
        color: Colors.Text.Primary.Default,
        backgroundColor: Colors.Background.Container.Primary.Default,
      }}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      marginTop={40}
      paddingY={12}
      paddingX={16}
    >
      <Flex flexDirection="column" alignItems="left" gap={4}>
        <Heading as="h2" level={6}>
          What&apos;s next?
        </Heading>
        <Paragraph>
          Fork this app on GitHub and learn how to write apps for Dynatrace.
        </Paragraph>
      </Flex>
      <Flex alignItems="right">
        <ExternalLink href="https://github.com/Dynatrace/multi-monitor-updater">
          Fork on Github
        </ExternalLink>
      </Flex>
    </Flex>
  );
};
