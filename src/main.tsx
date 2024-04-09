import React from 'react';
import { createRoot } from 'react-dom/client'
import { AppRoot } from '@dynatrace/strato-components-preview';
import { createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import { App } from './app/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Tracking } from '@dynatrace-sdk/ui-monitoring-events';
import { createBrowserRouter } from '@dynatrace-sdk/ui-monitoring-events/react-router-dom-v6';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

const Routing = (
  <Route
    path=''
    element={<App />}>
  </Route>
)

const root = createRoot(document.getElementById('root')!);
root.render(
  <AppRoot>
    <Tracking>
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={createBrowserRouter(createRoutesFromElements(Routing), {
            basename: '/ui',
          })}></RouterProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Tracking>
  </AppRoot>,
);
