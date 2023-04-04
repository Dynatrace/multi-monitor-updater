import React from 'react';
import {ExternalLink, Flex, Heading, Text} from '@dynatrace/strato-components-preview';
import Colors from '@dynatrace/strato-design-tokens/colors';
import Spacings from '@dynatrace/strato-design-tokens/spacings';
import Borders from '@dynatrace/strato-design-tokens/borders';


export const MainViewCard = () => {
  return (
    (<Flex
      style={{
        borderStyle: `${Borders.Style.Default}`,
        borderWidth: `${Borders.Width.Emphasized}`,
        borderRadius: `${Borders.Radius.Container.Default}`,
        borderColor: `${Colors.Border.Primary.Default}`,
        color: `${Colors.Text.Primary.Default}`,
        backgroundColor: `${Colors.Background.Container.Primary.Default}`,
        padding: `${Spacings.Size12} ${Spacings.Size16}`,
      }}
      flexWrap="wrap" gap={16}
    >
      <Flex flexGrow={1}>
        <Flex alignSelf={"center"} flexDirection="column" gap={4}>
          <Heading level={6}>What's next?</Heading>
          <Text>
            Fork this app on GitHub and learn how to write apps for Dynatrace.
          </Text>
        </Flex>
      </Flex>
      <Flex justifyContent="center" alignSelf={"center"}>
          <ExternalLink href="https://github.com/Dynatrace/multi-monitor-updater">Fork on Github</ExternalLink>
      </Flex>
    </Flex>)
  );
};
