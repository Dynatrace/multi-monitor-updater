import { syntheticMonitorsClient, SyntheticMonitorUpdate } from '@dynatrace-sdk/client-classic-environment-v1';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
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
          onSettled: () => { setProgress((prev) => prev + 1) },
        });
      });
      return Promise.allSettled(promises).then((results) => {
        const isError = results.some((result) => result.status === 'rejected');

        if (isError) {
          setStatus('error')
        } else {
          setStatus('success');
          queryClient.invalidateQueries({ queryKey: ['monitor'], type: 'all' });
        }
        return results;
      });
    },
    [mutation, queryClient],
  );

  return { progress, status, mutate, total };
}
