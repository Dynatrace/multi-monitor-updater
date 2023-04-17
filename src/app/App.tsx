import React, { useState } from 'react';
import { Page, AppHeader, Flex, Heading, List, Text, TitleBar } from '@dynatrace/strato-components-preview';
import { Spacings } from '@dynatrace/strato-design-tokens';
import { Home } from './components/monitors/Home';
import { SideBarContent } from './components/SideBarContent';
import { WhatsNext } from './components/WhatsNext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const App = () => {
  const [detailsDismissed, setDetailsDismissed] = useState<boolean>(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Page>
        <Page.Header>
          <AppHeader />
        </Page.Header>
        <Page.Main>
          <Flex flexDirection='column' alignItems='center' paddingY={16}>
            <Flex maxWidth={'80vw'} gap={16} flexDirection='column'>
              <TitleBar>
                <TitleBar.Title>
                  <Heading as='h1'>Multi Monitor Updater</Heading>
                </TitleBar.Title>
                <TitleBar.Suffix>
                  <img
                    src='./assets/logo.png'
                    alt='Multi Monitor Updater icon'
                    style={{
                      height: Spacings.Size64,
                    }}
                  />
                </TitleBar.Suffix>
                <TitleBar.Subtitle>
                  With the help of this tutorial app you'll be able to quickly and easily build your own app that uses
                  synthetic configurations. This is also a fully functional app that allows bulk updates of synthetic
                  monitors configurations. You can adapt this approach to your purposes and apply it to other types of
                  configurations.
                </TitleBar.Subtitle>
              </TitleBar>
              <Heading as='h2' level={4}>
                This app demonstrates:
              </Heading>
              <List>
                <Text>how to build your own app that uses Dynatrace API and core UI components,</Text>
                <Text>how to deal with bulk updates of synthetic monitors configurations,</Text>
                <Text>how to display the results in the app UI.</Text>
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
    </QueryClientProvider>
  );
};
