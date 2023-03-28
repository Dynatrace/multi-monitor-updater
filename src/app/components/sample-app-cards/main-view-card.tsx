import React from 'react';
import {ExternalLink, Flex, Heading, Text} from '@dynatrace/strato-components-preview';
import Colors from '@dynatrace/strato-design-tokens/colors';
import Spacings from '@dynatrace/strato-design-tokens/spacings';
import Borders from '@dynatrace/strato-design-tokens/borders';

export const MainViewCard = (): JSX.Element => {
  return (
    <Flex
      style={{
        background: `${Colors.Theme.Background[20]}`,
        borderColor: `${Colors.Border.Neutral.Default}`,
        borderRadius: `${Borders.Radius.Container.Default}`,
        borderWidth: `${Borders.Width.Default}`,
        borderStyle: `${Borders.Style.Default}`,
        padding: `${Spacings.Size12}`,
        marginTop: `${Spacings.Size24}`,
        textDecoration: "none",
      }}
    >
      <Flex flexGrow={1}>
        <Flex alignSelf={"center"} flexDirection="column" gap={4}>
          <Heading level={6}>What's next?</Heading>
          <Text>
            Fork this app on GitHub and learn how to write apps for Dynatrace
          </Text>
        </Flex>
      </Flex>
      <Flex justifyContent="center">
        <Flex alignSelf={"center"}>
          <ExternalLink href="https://github.com/Dynatrace/multi-monitor-updater">Fork on Github</ExternalLink>
        </Flex>
      </Flex>
    </Flex>
  );
};