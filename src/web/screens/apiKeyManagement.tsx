import { Suspense } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ApiRoleDTO } from '../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../api/services/adminServiceHelpers';
import KeyCreationDialog from '../components/ApiKeyManagement/KeyCreationDialog';
import { OnApiKeyDisable } from '../components/ApiKeyManagement/KeyDisableDialog';
import { OnApiKeyEdit } from '../components/ApiKeyManagement/KeyEditDialog';
import KeyTable from '../components/ApiKeyManagement/KeyTable';
import { Loading } from '../components/Core/Loading';
import {
  CreateApiKey,
  CreateApiKeyFormDTO,
  DisableApiKey,
  EditApiKey,
} from '../services/apiKeyService';
import {
  GetParticipantApiKey,
  GetParticipantApiKeys,
  GetParticipantApiRoles,
} from '../services/participant';
import { handleErrorToast } from '../utils/apiError';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './apiKeyManagement.scss';

function ApiKeyManagement() {
  const data = useLoaderData() as {
    result: ApiKeyDTO[];
  };

  const reloader = useRevalidator();

  const onKeyCreation = async (form: CreateApiKeyFormDTO, participantId?: number) => {
    try {
      const keySecret = await CreateApiKey(form, participantId);
      reloader.revalidate();
      return keySecret;
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const onKeyEdit: OnApiKeyEdit = async (form, setApiKey) => {
    try {
      await EditApiKey(form);
      setApiKey(await GetParticipantApiKey(form.keyId));
      toast.success('Your key has been updated');
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const onKeyDisable: OnApiKeyDisable = async (apiKey) => {
    try {
      await DisableApiKey(apiKey);
      reloader.revalidate();
      toast.success('Your key has been disabled');
    } catch (e) {
      handleErrorToast(e);
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
              <KeyTable
                apiKeys={apiKeys.filter((key) => !key.disabled)}
                onKeyEdit={onKeyEdit}
                onKeyDisable={onKeyDisable}
                availableRoles={apiRoles}
              />
              {apiRoles.length > 0 && (
                <div className='create-new-key'>
                  <KeyCreationDialog
                    availableRoles={apiRoles}
                    onKeyCreation={onKeyCreation}
                    triggerButton={
                      <button className='small-button' type='button'>
                        Create Key
                      </button>
                    }
                  />
                </div>
              )}
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
