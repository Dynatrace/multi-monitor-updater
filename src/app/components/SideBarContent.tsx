import { Button, Heading, Flex, Text } from '@dynatrace/strato-components-preview';
import { ChatIcon, CodeIcon, XmarkIcon } from '@dynatrace/strato-icons';
import React from 'react';
import { DetailsCard } from './DetailsCard';
import { GithubIcon } from './GithubIcon';
import { FormattedMessage, useIntl } from 'react-intl';

interface SideBarContentProps {
  onClose: () => void;
}

export const SideBarContent = ({ onClose }: SideBarContentProps) => {
  const i18n = useIntl();
  return (
    <Flex flexDirection='column' paddingTop={32} gap={6}>
      <Flex flexDirection='row' justifyContent='space-between'>
        <Heading as='h2' level={4}>
          <FormattedMessage
            defaultMessage='Ready to develop?'
            id="ecxLd5rXQg9F7skO"
          />
        </Heading>
        <Button aria-label={i18n.formatMessage({defaultMessage: 'Close Details', id: 'GkQXxaZ3X+bh8KO8' })} onClick={onClose}>
          <Button.Suffix>
            <XmarkIcon />
          </Button.Suffix>
        </Button>
      </Flex>
      <Flex flexDirection='column' gap={12}>
        <Text textStyle='small'>
          <FormattedMessage
            defaultMessage='Learn to write apps with Dynatrace Developer and the Dynatrace Community'
            id="zyYnaYe9dzYcwAN2"
          />
        </Text>
        <DetailsCard
          href='https://dynatrace.dev/'
          icon={<CodeIcon />}
          title='Learn to create apps'
          text='Dynatrace Developer shows you how'
        />
        <DetailsCard
          href='https://community.dynatrace.com/'
          icon={<ChatIcon />}
          title='Join Dynatrace Community'
          text='Ask questions, get answers, share ideas'
        />
        <DetailsCard
          href='https://github.com/Dynatrace/multi-monitor-updater'
          icon={<GithubIcon />}
          title='Collaborate in GitHub'
          text='Start your own app by cloning it on Github'
        />
      </Flex>
    </Flex>
  );
};
