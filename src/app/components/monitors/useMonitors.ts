import { useQueries } from '@tanstack/react-query';
import { getMonitor } from './useMonitor';

export function useMonitors(monitorIds: string[]) {
  return useQueries({
    queries: monitorIds.map((monitorId) => ({
      queryKey: ['monitor', monitorId],
      queryFn: () => getMonitor(monitorId),
    })),
  });
}
