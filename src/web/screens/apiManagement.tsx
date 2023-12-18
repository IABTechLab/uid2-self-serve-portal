import { Suspense } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { ApiKeyDTO } from '../../api/services/adminServiceHelpers';
import KeyTable from '../components/ApiKeyManagement/KeyTable';
import { Loading } from '../components/Core/Loading';
import { GetParticipantApiKeys } from '../services/participant';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

function ManageParticipants() {
  const data = useLoaderData() as {
    result: ApiKeyDTO[];
  };

  return (
    <div>
      <h1>Manage API Keys</h1>
      <p className='heading-details'>View and manage your API keys.</p>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.result}>
          {(apiKeys: ApiKeyDTO[]) => <KeyTable apiKeys={apiKeys} />}
        </Await>
      </Suspense>
    </div>
  );
}

export const ApiManagementRoute: PortalRoute = {
  path: '/dashboard/api',
  description: 'API Key Management',
  element: <ManageParticipants />,
  errorElement: <RouteErrorBoundary />,
  loader: async () => {
    const apiKeysPromise = GetParticipantApiKeys();
    return defer({
      result: apiKeysPromise,
    });
  },
};
