import { Suspense, useState } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { ApiRoleDTO } from '../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../api/services/adminServiceHelpers';
import KeyCreationDialog from '../components/ApiKeyManagement/KeyCreationDialog';
import KeyTable from '../components/ApiKeyManagement/KeyTable';
import { Loading } from '../components/Core/Loading';
import { StatusNotificationType, StatusPopup } from '../components/Core/StatusPopup';
import { ApiKeyCreationFormDTO, CreateApiKey } from '../services/apiKeyService';
import { GetParticipantApiKeys, GetParticipantApiRoles } from '../services/participant';
import { handleErrorPopup } from '../utils/apiError';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './apiKeyManagement.scss';

function ApiKeyManagement() {
  const data = useLoaderData() as {
    result: ApiKeyDTO[];
  };

  const [statusPopup, setStatusPopup] = useState<StatusNotificationType>();
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const reloader = useRevalidator();

  const onKeyCreation = async (form: ApiKeyCreationFormDTO, participantId?: number) => {
    try {
      const keySecret = await CreateApiKey(form, participantId);
      reloader.revalidate();
      return keySecret;
    } catch (e) {
      handleErrorPopup(e, setStatusPopup, setShowStatusPopup);
    }
  };

  return (
    <div className='api-key-management-page'>
      <h1>Manage API Keys</h1>
      <p className='heading-details'>View and manage your API keys.</p>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.result}>
          {([apiKeys, apiRoles]: [ApiKeyDTO[], ApiRoleDTO[]]) => (
            <>
              <KeyTable apiKeys={apiKeys.filter((key) => !key.disabled)} />
              {apiRoles.length > 0 && (
                <KeyCreationDialog
                  availableRoles={apiRoles}
                  onKeyCreation={onKeyCreation}
                  triggerButton={
                    <button className='small-button create-key-button' type='button'>
                      Create Key
                    </button>
                  }
                />
              )}
            </>
          )}
        </Await>
      </Suspense>
      {statusPopup && (
        <StatusPopup
          status={statusPopup!.type}
          show={showStatusPopup}
          setShow={setShowStatusPopup}
          message={statusPopup!.message}
        />
      )}
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
