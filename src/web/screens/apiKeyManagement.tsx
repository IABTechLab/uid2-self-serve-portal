import { Suspense } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { ApiRoleDTO } from '../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../api/services/adminServiceHelpers';
import KeyCreationDialog from '../components/ApiKeyManagement/KeyCreationDialog';
import KeyTable from '../components/ApiKeyManagement/KeyTable';
import { Loading } from '../components/Core/Loading';
import { ApiKeyCreationFormDTO, CreateApiKey } from '../services/apiKeyService';
import { GetParticipantApiKeys, GetParticipantApiRoles } from '../services/participant';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

function ApiKeyManagement() {
  const data = useLoaderData() as {
    result: ApiKeyDTO[];
  };

  const reloader = useRevalidator();

  const onKeyCreation = async (form: ApiKeyCreationFormDTO, participantId?: number) => {
    const keySecret = await CreateApiKey(form, participantId);
    reloader.revalidate();
    return keySecret;
  };

  return (
    <div>
      <h1>Manage API Keys</h1>
      <p className='heading-details'>View and manage your API keys.</p>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.result}>
          {([apiKeys, apiRoles]: [ApiKeyDTO[], ApiRoleDTO[]]) => (
            <>
              <KeyTable apiKeys={apiKeys.filter((key) => !key.disabled)} />
              <KeyCreationDialog
                availableRoles={apiRoles}
                onKeyCreation={onKeyCreation}
                triggerButton={
                  <button className='small-button' type='button'>
                    Add API Key
                  </button>
                }
              />
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export const ApiKeyManagementRoute: PortalRoute = {
  path: '/dashboard/apiKeyManagement',
  description: 'API Key Management',
  element: <ApiKeyManagement />,
  errorElement: <RouteErrorBoundary />,
  loader: async () => {
    const apiKeysPromise = GetParticipantApiKeys();
    const apiRolesPromise = GetParticipantApiRoles();
    const promises = Promise.all([apiKeysPromise, apiRolesPromise]);
    return defer({
      result: promises,
    });
  },
};
