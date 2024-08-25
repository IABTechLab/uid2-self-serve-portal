import { Suspense, useContext, useState } from 'react';
import { useRevalidator } from 'react-router-dom';
import { defer, useLoaderData } from 'react-router-typesafe';

import KeyCreationDialog from '../components/ApiKeyManagement/KeyCreationDialog';
import { OnApiKeyDisable } from '../components/ApiKeyManagement/KeyDisableDialog';
import { OnApiKeyEdit } from '../components/ApiKeyManagement/KeyEditDialog';
import KeyTable from '../components/ApiKeyManagement/KeyTable';
import { Loading } from '../components/Core/Loading/Loading';
import { SuccessToast } from '../components/Core/Popups/Toast';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import { ParticipantContext } from '../contexts/ParticipantProvider';
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
import { AwaitTypesafe, resolveAll } from '../utils/AwaitTypesafe';
import { makeParticipantLoader } from '../utils/loaderHelpers';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

const loader = makeParticipantLoader((participantId) => {
  return defer({
    apiKeys: GetParticipantApiKeys(participantId),
    apiRoles: GetParticipantApiRoles(participantId),
  });
});

function ApiKeyManagement() {
  const [showKeyCreationDialog, setShowKeyCreationDialog] = useState<boolean>(false);
  const data = useLoaderData<typeof loader>();
  const { participant } = useContext(ParticipantContext);

  const reloader = useRevalidator();

  const onKeyCreation = async (form: CreateApiKeyFormDTO) => {
    try {
      const keySecret = await CreateApiKey(form, participant!.id);
      reloader.revalidate();
      return keySecret;
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const onKeyEdit: OnApiKeyEdit = async (form, setApiKey) => {
    try {
      await EditApiKey(form, participant!.id);
      setApiKey(await GetParticipantApiKey(form.keyId, participant!.id));
      SuccessToast('Your key has been updated');
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const onKeyDisable: OnApiKeyDisable = async (apiKey) => {
    try {
      await DisableApiKey(apiKey, participant!.id);
      reloader.revalidate();
      SuccessToast('Your key has been deleted.');
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const onKeyCreationDialogChange = () => {
    setShowKeyCreationDialog(!showKeyCreationDialog);
  };

  return (
    <>
      <h1>API Keys</h1>
      <p className='heading-details'>
        View and manage your API keys. For more information, see{' '}
        <a
          target='_blank'
          className='outside-link'
          href='https://unifiedid.com/docs/portal/api-keys'
          rel='noreferrer'
        >
          managing and rotating API keys
        </a>
        .
      </p>
      <ScreenContentContainer>
        <Suspense fallback={<Loading />}>
          <AwaitTypesafe resolve={resolveAll({ apiKeys: data.apiKeys, apiRoles: data.apiRoles })}>
            {(loadedData) => (
              <>
                <KeyTable
                  apiKeys={loadedData.apiKeys}
                  onKeyEdit={onKeyEdit}
                  onKeyDisable={onKeyDisable}
                  availableRoles={loadedData.apiRoles}
                />
                {loadedData.apiRoles.length > 0 && (
                  <div className='create-new-key'>
                    <button
                      className='small-button'
                      type='button'
                      onClick={onKeyCreationDialogChange}
                    >
                      Add API Key
                    </button>
                    {showKeyCreationDialog && (
                      <KeyCreationDialog
                        availableRoles={loadedData.apiRoles}
                        onKeyCreation={onKeyCreation}
                        onOpenChange={onKeyCreationDialogChange}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </AwaitTypesafe>
        </Suspense>
      </ScreenContentContainer>
    </>
  );
}

export const ApiKeyManagementRoute: PortalRoute = {
  path: '/participant/:participantId/apiKeys',
  description: 'API Keys',
  element: <ApiKeyManagement />,
  errorElement: <RouteErrorBoundary />,
  loader,
};
