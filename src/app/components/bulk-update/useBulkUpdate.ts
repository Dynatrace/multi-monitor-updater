import { syntheticMonitorsClient, SyntheticMonitorUpdate } from '@dynatrace-sdk/client-classic-environment-v1';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

async function replaceMonitor(update: BulkUpdate) {
  return syntheticMonitorsClient.replaceMonitor({
    body: update.updatedConfig,
    monitorId: update.monitorId,
  });
}

type BulkUpdate = {
  monitorId: string;
  updatedConfig: SyntheticMonitorUpdate;
};

function useReplaceMonitor() {
  return useMutation({
    mutationFn: replaceMonitor,
  });
}

export function useBulkUpdate() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  const mutation = useReplaceMonitor();
  const mutate = useCallback(
    (updates: Array<BulkUpdate>) => {
      setTotal(updates.length);
      setStatus('loading');
      const promises = updates.map((update) => {
        return mutation.mutateAsync(update, {
          onSettled: () => setProgress((prev) => prev + 1),
          onError: () => {
            setStatus('error');
          },
        });
      });
      Promise.allSettled(promises).then((results) => {
        if (status !== 'error') {
          setStatus('success');
        }
        return results;
      });
    },
    [mutation, status],
  );

  return { progress, status, mutate, total };
}
