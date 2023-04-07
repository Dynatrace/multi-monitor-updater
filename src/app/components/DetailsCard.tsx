import React, { ReactElement } from "react";
import styled from "styled-components";
import {
  Flex,
  Heading,
  Link,
  Text,
} from "@dynatrace/strato-components-preview";
import {
  Borders,
  BoxShadows,
  Colors,
  Spacings,
} from "@dynatrace/strato-design-tokens";
import { ExternalLinkIcon } from "@dynatrace/strato-icons";

const StyledLink = styled(Link)({
  color: Colors.Text.Neutral.Default,
  background: Colors.Theme.Background[20],
  borderRadius: Borders.Radius.Surface.Default,
  padding: Spacings.Size8,
  paddingRight: Spacings.Size20,
  textDecoration: "none",
  display: "block",
  "&:hover": {
    boxShadow: BoxShadows.Surface.Flat.Hover,
  },
});

interface DetailsCardProps {
  /** Absolute or relative link for the Card */
  href: string;
  /** The src for the image to show. */
  icon: ReactElement;
  /** The title shown on the card. */
  title: string;
  /** The text shown on the Card. */
  text: string;
}

export const DetailsCard = ({ href, icon, title, text }: DetailsCardProps) => {
  return (
    <StyledLink target="_blank" href={href} rel="noopener noreferrer">
      <Flex flexDirection="row" alignItems="center" padding={8} gap={12}>
        <Flex
          flexShrink={0}
          alignItems="center"
          justifyContent="center"
          style={{
            width: Spacings.Size56,
            height: Spacings.Size56,
            border: Colors.Border.Neutral.Default,
            borderRadius: Borders.Radius.Container.Subdued,
            background: Colors.Background.Container.Neutral.Subdued,
            boxShadow: BoxShadows.Surface.Raised.Rest,
          }}
        >
          {icon}
        </Flex>
        <Flex flexDirection={"column"} gap={4} flexGrow={1}>
          <Heading as="h3" level={5}>
            {title}
          </Heading>
          <Text textStyle={"small"}>{text}</Text>
        </Flex>
        <ExternalLinkIcon />
      </Flex>
    </StyledLink>
  );
};
