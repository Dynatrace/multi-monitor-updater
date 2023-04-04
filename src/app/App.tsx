import React, {useState} from 'react';
import {
    _NewPage as Page,
    AppHeader,
    Button,
    Flex,
    Heading,
    List,
    Text,
    useCurrentTheme,
} from '@dynatrace/strato-components-preview';
import {MainViewCard} from './components/sample-app-cards/main-view-card';
import {DetailViewCard} from './components/sample-app-cards/detail-view-card';
import {Home} from './components/monitors/home';

export const App = () => {
  const [detailsDismissed, setDetailsDismissed] = useState<boolean>(false);
  const theme = useCurrentTheme();

  return (
    <Page>
      <Page.Header>
        <AppHeader></AppHeader>
      </Page.Header>
      <Page.Main>
        <Flex
          flexDirection="column"
          padding={32}
          gap={32}
          maxWidth="960px"
          alignSelf={"center"}
        >
          <Flex flexDirection="row" alignItems="center">
            <Flex flexDirection="column" gap={16}>
              <Flex gap={4} flexDirection="column">
                <Heading>Multi Monitor Updater</Heading>
                <Text>
                  With the help of this tutorial app you'll be able to quickly and easily build
                  your own app that uses synthetic configurations. This is also a fully functional
                  app that allows bulk updates of synthetic monitors configurations. You can adapt
                  this approach to your purposes and apply it to other types of configurations.
                </Text>
              </Flex>
              <Flex gap={4} flexDirection="column">
                <Heading level={4}>This app demonstrates</Heading>
                <List ordered={false}>
                  <Text>how to build your own app that uses Dynatrace API and core UI components,</Text>
                  <Text>how to deal with bulk updates of synthetic monitors configurations,</Text>
                  <Text>how to display the results in the app UI.</Text>
                </List>
              </Flex>
            </Flex>
            <Flex alignSelf={"flex-start"}>
              <img src={'./assets/logo.png'} width="90px" height="90px" />
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <Home />
          </Flex>
          <MainViewCard></MainViewCard>
        </Flex>
      </Page.Main>
      <Page.DetailView
        onDismiss={() => setDetailsDismissed(true)}
        dismissed={detailsDismissed}
      >
        <Flex
          flexDirection="column"
          gap={16}
          paddingTop={32}
          paddingLeft={8}
          paddingRight={8}
        >
          <Flex gap={4} flexDirection="column">
            <Heading level={4}>Ready to develop?</Heading>
            <Text>
              Learn to write apps with Dynatrace Developer and the Dynatrace
              community.
            </Text>
          </Flex>
          <DetailViewCard
            href="https://developer.dynatrace.com/preview/getting-started/quickstart/"
            imgSrc={
              theme === "light"
                ? "./assets/DevPortalLogo_light@3x.png"
                : "./assets/DevPortalLogo_dark@3x.png"
            }
            headline="Learn to create apps"
            text="Dynatrace Developer shows you how"
          ></DetailViewCard>
          <DetailViewCard
            href="https://community.dynatrace.com/t5/Developers/ct-p/developers"
            imgSrc={
              theme === "light"
                ? "./assets/CommunityIcon_light@3x.png"
                : "./assets/CommunityIcon_dark@3x.png"
            }
            headline="Join Dynatrace Community"
            text="Ask questions, get answers, share ideas"
          ></DetailViewCard>
          <DetailViewCard
            href="https://github.com/Dynatrace/multi-monitor-updater"
            imgSrc={
              theme === "light"
                ? "./assets/GitBranchIcon_light@3x.png"
                : "./assets/GitBranchIcon_dark@3x.png"
            }
            headline="Collaborate in GitHub"
            text="Start your own app by forking it on GitHub"
          ></DetailViewCard>
          <Button onClick={() => setDetailsDismissed(true)}>Hide for now</Button>
        </Flex>
      </Page.DetailView>
    </Page>
  );
};
