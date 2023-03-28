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
import {CodeIcon, GroupIcon} from '@dynatrace/strato-icons';
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
        <Flex flexDirection="column" width="100%" alignItems="center">
          <Flex flexDirection="column" padding={40} gap={16} maxWidth="960px">
              <Heading>Multi Monitor Updater</Heading>
            <Text>
              With the help of this tutorial app you'll be able to quickly and easily build
              your own app that uses synthetic configurations. This is also a fully functional
              app that allows bulk updates of synthetic monitor configurations. You can adapt
              this approach to your purposes and apply it to other types of configurations.
            </Text>
            <Heading level={4}>This app demonstrates</Heading>
            <List ordered={false}>
              <Text>how to update synthetic monitor configurations,</Text>
              <Text>how to deal with bulk updates of synthetic monitor configurations,</Text>
              <Text>how to display the results in the app UI.</Text>
            </List>
            <MainViewCard></MainViewCard>
            <Heading level={4}>Try it live</Heading>
          </Flex>
        </Flex>
        <Home />
      </Page.Main>
      <Page.DetailView
        onDismiss={() => setDetailsDismissed(true)}
        dismissed={detailsDismissed}
        preferredWidth={360}
      >
        <Flex
          flexDirection="column"
          gap={16}
          paddingTop={40}
          paddingLeft={8}
          paddingRight={8}
        >
          <Heading level={4}>Ready to develop?</Heading>
          <Text>
            Learn to write apps with Dynatrace Developer and the Dynatrace
            community.
          </Text>
          <DetailViewCard
            href="https://developer.dynatrace.com/preview/getting-started/quickstart/"
            icon={
              theme === "light" ? (
                <img src={"./assets/dynatrace-logo-light.svg"} alt="dynatrace logo"></img>
              ) : (
                <img src={"./assets/dynatrace-logo-dark.svg"} alt="dynatrace logo"></img>
              )
            }
            headline="Learn to create apps"
            text="Dynatrace Developer shows you how"
          ></DetailViewCard>
          <DetailViewCard
            href="https://community.dynatrace.com/t5/Developers/ct-p/developers"
            icon={<GroupIcon />}
            headline="Join Dynatrace Community"
            text="Ask questions, get answers, share ideas"
          ></DetailViewCard>
          <DetailViewCard
            href="https://github.com/Dynatrace/multi-monitor-updater"
            icon={<CodeIcon />}
            headline="Collaborate in GitHub"
            text="Start your own app by forking it on GitHub"
          ></DetailViewCard>
          <Button onClick={() => setDetailsDismissed(true)}>Hide for now</Button>
        </Flex>
      </Page.DetailView>
    </Page>
  );
};
