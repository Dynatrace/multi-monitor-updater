import React, { useState } from 'react';
import { AppHeader, Flex, Heading, List, Page, Text, TitleBar } from '@dynatrace/strato-components-preview';
import { Spacings } from '@dynatrace/strato-design-tokens';
import { Home } from './components/monitors/Home';
import { SideBarContent } from './components/SideBarContent';
import { WhatsNext } from './components/WhatsNext';
import { FormattedMessage, useIntl } from 'react-intl';

export const App = () => {
  const i18n = useIntl();
  const [detailsDismissed, setDetailsDismissed] = useState<boolean>(false);

  return (
    <Page>
      <Page.Header>
        <AppHeader />
      </Page.Header>
      <Page.Main>
        <Flex flexDirection='column' alignItems='center' paddingY={16}>
          <Flex maxWidth={'80vw'} gap={16} flexDirection='column'>
            <TitleBar>
              <TitleBar.Title>
                <Heading as='h1'>
                  <FormattedMessage
                    defaultMessage='Multi-Monitor Updater Sample'
                    id="OiCTjA6Yj0OU23If"
                  />
                </Heading>
              </TitleBar.Title>
              <TitleBar.Action>
                <img
                  src='./assets/logo.png'
                  alt={i18n.formatMessage({ defaultMessage: 'Multi-Monitor Updater icon', id: 'Ortad3ncqk0MnqIX' })}
                  style={{
                    height: Spacings.Size64,
                  }}
                />
              </TitleBar.Action>
              <TitleBar.Subtitle>
                <FormattedMessage
                  defaultMessage='With the help of this tutorial app you&apos;ll be able to quickly and easily build your own app that uses
                  synthetic configurations. This is also a fully functional app that allows bulk updates of synthetic
                  monitors configurations. You can adapt this approach to your purposes and apply it to other types of
                  configurations.'
                  id="xYtq0EaSo7rIQ30B"
                />
              </TitleBar.Subtitle>
            </TitleBar>
            <Heading as='h2' level={4}>
              <FormattedMessage
                defaultMessage='This app demonstrates:'
                id="LY+AVp34BG6z7PqI"
              />
            </Heading>
            <List>
              <Text>
                <FormattedMessage
                  defaultMessage='how to build your own app that uses Dynatrace API and core UI components,'
                  id="UPSUFNWMwIz9Cs2+"
                />
              </Text>
              <Text>
                <FormattedMessage
                  defaultMessage='how to deal with bulk updates of synthetic monitors configurations,'
                  id="3qnmftax1iAOkdPk"
                />
              </Text>
              <Text>
                <FormattedMessage
                  defaultMessage='how to display the results in the app UI.'
                  id="3rzTKOFVU1wjLmZv"
                />
              </Text>
            </List>
            <Home />
            <WhatsNext />
          </Flex>
        </Flex>
      </Page.Main>
      <Page.DetailView onDismissChange={(state) => setDetailsDismissed(state)} dismissed={detailsDismissed}>
        <SideBarContent onClose={() => setDetailsDismissed(true)} />
      </Page.DetailView>
    </Page>
  );
};
