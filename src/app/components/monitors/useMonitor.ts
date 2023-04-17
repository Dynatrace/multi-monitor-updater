import { syntheticMonitorsClient } from '@dynatrace-sdk/client-classic-environment-v1';
import { useQuery } from '@tanstack/react-query';

export async function getMonitor(monitorId: string) {
  return syntheticMonitorsClient.getMonitor({ monitorId });
}

export function useMonitor(monitorId: string) {
  return useQuery({
    queryKey: ['monitor', monitorId],
    queryFn: () => getMonitor(monitorId),
  });
}
