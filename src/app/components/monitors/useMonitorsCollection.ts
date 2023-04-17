import { FilterItemValues } from '@dynatrace/strato-components-preview';
import { useQuery } from '@tanstack/react-query';
import { MonitorCollectionElement, syntheticMonitorsClient } from '@dynatrace-sdk/client-classic-environment-v1';

interface MonitorsQueryConfig {
  type?: string;
  assignedApps?: string[];
  tag?: string[];
  location?: string;
}

function createMonitorsConfig(filterItemValues: FilterItemValues): MonitorsQueryConfig {
  const config: MonitorsQueryConfig = {};
  Object.entries(filterItemValues).forEach(([key, { value }]) => {
    switch (key) {
      case 'type':
        const filterValues = value as string[];
        config.type = filterValues[0] !== 'ALL' ? filterValues[0] : undefined;
        break;
      case 'location':
        const location = value as string;
        config.location = location?.length > 0 ? location : undefined;
        break;
      case 'assignedApps':
        const assignedApps = value as string;
        config.assignedApps = assignedApps?.length > 0 ? [assignedApps] : undefined;
        break;
      case 'tag':
        const tag = value as string[]; // TODO: this should be an array of tags on the API but i don't see this handled somewhere
        config.tag = tag?.length > 0 ? tag : undefined;
        break;
    }
  });
  return config;
}

async function getMonitorsCollection(config: MonitorsQueryConfig) {
  return syntheticMonitorsClient
    .getMonitorsCollection(config)
    .then((res) => res.monitors.sort((a, b) => a.name.localeCompare(b.name)));
}

export function useMonitorsCollection(
  filterItemValues: FilterItemValues,
  onSuccess: (data: MonitorCollectionElement[]) => void,
) {
  const config = createMonitorsConfig(filterItemValues);

  return useQuery({
    queryKey: ['monitors', config],
    queryFn: () => getMonitorsCollection(config),
    onSuccess,
  });
}
