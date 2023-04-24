# Sample App “Multi-Monitor Updater”

The **Multi Monitor Updater** is a sample app for the [Dynatrace Platform](https://www.dynatrace.com/platform/), specifically the [AppEngine](https://www.dynatrace.com/platform/appengine/). 

It shows you how to
* Use Dynatrace API and core UI components.
* Make bulk updates of synthetic configurations


## Try out

You can try out this app by installing it from the Dynatrace Hub.


## Documentation

You can find documentation for all tools, SDKs and features used in this app from [Developer Portal](https://developer.dynatrace.com/preview/sample-apps/multi-monitor-updater/).


## Getting Started
Our sample apps give a good overview of how Dynatrace Apps can help solve specific use cases. However, we recommend starting your learning journey through our [Get started with the Dynatrace platform](https://developer.dynatracelabs.com/getting-started/tutorial/) tutorial. In the tutorial, you'll learn all aspects of the development process by incorporating our [SDKs](https://developer.dynatracelabs.com/reference/sdks/), the [Strato design system](https://developer.dynatracelabs.com/reference/design-system/), and tools such as our [Dynatrace App Toolkit](https://developer.dynatracelabs.com/reference/cli/).


## Support

Please note that the app is intended mostly for educational purposes. It aims to illustrate the main concepts of app development and should be easy to understand. Therefore it provides only limited functionality and does not always cover all edge cases. You can use the app as a starting point for your own development. It is covered under the “light support” provisions of the Dynatrace terms and conditions.

## Getting Started with your Dynatrace App

This project was bootstrapped with DTP CLI.

It uses React in combination with TypeScript, to provide great developer experience.

## Available Scripts

In the project directory, you can run:

### `npm run start` or `yarn start`

Runs the app in the development mode.
A new browser window with your running app will be automatically opened.

Edit a component file in `src` and save it. The page will reload when you make changes.
You may also see any errors in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `dist` folder.
It correctly bundles your app in production mode and optimizes the build for the best performance.

### `npm run deploy` or `yarn deploy`

Builds the app and deploys it to the specified environment in `dtp.config.ts`.

### `npm run uninstall` or `yarn uninstall`

Uninstalls the app from the specified environment in `dtp.config.ts`.

### `npm run generate:function` or `yarn generate:function`

Generates a new serverless function for your app in the `api` folder.

### `npm run update` or `yarn update`

Updates @dynatrace-scoped packages to the latest version and applies automatic migrations.

### `npm run info` or `yarn info`

Outputs the CLI and environment information.

### `npm run help` or `yarn run help`

Outputs help for the DTP CLI.

## Learn more

You can find more information on how to use all the features of the new Dynatrace Platform in the [Developer Portal](https://developer.dynatracelabs.com/).

To learn React, check out the [React documentation](https://reactjs.org/).
