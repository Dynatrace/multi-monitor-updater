import React from 'react';
import { Container, ExternalLink, Flex, Heading, Paragraph } from '@dynatrace/strato-components-preview';
import { FormattedMessage } from 'react-intl';

export const WhatsNext = () => {
  return (
    <Container
      as={Flex}
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
      marginTop={40}
      paddingY={12}
      paddingX={16}
    >
      <Flex flexDirection='column' alignItems='flex-start' gap={4}>
        <Heading as='h2' level={6}>
          <FormattedMessage
            defaultMessage='What&apos;s next?'
            id="PUs2vFdFe5kgmVEC"
          />
        </Heading>
        <Paragraph>
          <FormattedMessage
            defaultMessage='Fork this app on GitHub and learn how to write apps for Dynatrace.'
            id="eoIzSOxbamBnxaF0"
          />
        </Paragraph>
      </Flex>
      <Flex alignItems='flex-end'>
        <ExternalLink href='https://github.com/Dynatrace/multi-monitor-updater'>
          <FormattedMessage
            defaultMessage='Fork on Github'
            id="DQwSD5+JNxsRLhuT"
          />
        </ExternalLink>
      </Flex>
    </Container>
  );
};
