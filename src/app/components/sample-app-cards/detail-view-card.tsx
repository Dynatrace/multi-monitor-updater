import React from 'react';
import styled from 'styled-components';
import {Flex, Heading, Link, Text} from '@dynatrace/strato-components-preview';
import Colors from '@dynatrace/strato-design-tokens/colors';
import Spacings from '@dynatrace/strato-design-tokens/spacings';
import Borders from '@dynatrace/strato-design-tokens/borders';
import {ExternalLinkIcon} from '@dynatrace/strato-icons';


type DetailViewCardProps = {
  href: string;
  icon: React.ReactNode;
  headline: string;
  text: string;
};

const StyledWrapper = styled(Link)`
  color: ${Colors.Text.Neutral.Default};
  background: ${Colors.Theme.Background[20]};
  border-radius: ${Borders.Radius.Container.Default};
  padding: ${Spacings.Size8};
  padding-right: ${Spacings.Size20};
  text-decoration: "none";
  display: "block";
`;

export const DetailViewCard = ({
                                 href,
                                 icon,
                                 headline,
                                 text,
                               }: DetailViewCardProps): JSX.Element => {
  return (
    <StyledWrapper target="_blank" href={href} rel="noopener noreferrer">
      <Flex flexDirection="row" width="100%" gap={16}>
        <Flex alignItems={"center"}>
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            style={{
              backgroundColor: `${Colors.Background.Container.Neutral.Default}`,
              width: `${Spacings.Size56}`,
              height: `${Spacings.Size56}`,
              borderRadius: `${Borders.Radius.Container.Default}`,
            }}
          >
            {icon}
          </Flex>
        </Flex>
        <Flex flexGrow={1}>
          <Flex alignSelf={"center"} flexDirection="column" gap={4}>
            <Heading level={6}>{headline}</Heading>
            <Text>{text}</Text>
          </Flex>
        </Flex>
        <Flex justifyContent="center">
          <Flex alignSelf={"center"}>
            <ExternalLinkIcon />
          </Flex>
        </Flex>
      </Flex>
    </StyledWrapper>
  );
};