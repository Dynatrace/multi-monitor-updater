import type { CliOptions } from 'dt-app';

const config: CliOptions = {
  environmentUrl: 'https://umsaywsjuo.dev.apps.dynatracelabs.com/',
  app: {
    name: 'Multi-Monitor Updater',
    version: '1.1.2',
    description: 'Verify and update your Synthetic monitor configurations',
    id: 'my.multi.monitor.updater',
    scopes: [
      { name: 'environment-api:synthetic-monitors:read', comment: 'allows querying synthetic monitors api' },
      { name: 'environment-api:synthetic-monitors:write', comment: 'allows modifying synthetic monitor configuration' },
    ],
  },
  icon: './src/assets/logo.png',
};

module.exports = config;
