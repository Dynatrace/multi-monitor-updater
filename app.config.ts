import type { CliOptions } from 'dt-app';

const config: CliOptions = {
  environmentUrl: 'please-change.apps.dynatrace.com',
  app: {
    name: 'Multi-Monitor Updater',
    version: '1.1.3',
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
