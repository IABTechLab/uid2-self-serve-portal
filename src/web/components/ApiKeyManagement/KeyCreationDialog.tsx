import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeySecretsDTO } from '../../../api/services/apiKeyService';
import { CreateApiKeyFormDTO } from '../../services/apiKeyService';
import { sortApiRoles } from '../../utils/apiRoles';
import { Secret } from '../Core/Buttons/CopySecretButton';
import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import DisplaySecret from '../Core/DisplaySecret/DisplaySecret';
import { Dialog } from '../Core/Popups/Dialog';
import { InfoToast } from '../Core/Popups/Toast';
import { MultiCheckboxInput } from '../Input/MultiCheckboxInput';
import { TextInput } from '../Input/TextInput';

import './KeyCreationDialog.scss';

type KeySecretProp = ApiKeySecretsDTO | undefined;

type KeyCreationDialogProps = Readonly<{
  onKeyCreation: (form: CreateApiKeyFormDTO) => Promise<KeySecretProp>;
  availableRoles: ApiRoleDTO[];
  onOpenChange: () => void;
}>;

type CreateApiKeyFormProps = Readonly<{
  onFormSubmit: SubmitHandler<CreateApiKeyFormDTO>;
  availableRoles: ApiRoleDTO[];
  closeDialog: () => void;
}>;

type ApiKeySecretsProps = Readonly<{
  keySecrets: ApiKeySecretsDTO;
  closeDialog: () => void;
}>;

function CreateApiKeyForm({ onFormSubmit, availableRoles, closeDialog }: CreateApiKeyFormProps) {
  const formMethods = useForm<CreateApiKeyFormDTO>();
  const { handleSubmit } = formMethods;
  return (
    <>
      <h1>Add API Key</h1>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <TextInput
            inputName='name'
            label='Name'
            rules={{
              required: 'Please specify an API Key name.',
            }}
          />
          <MultiCheckboxInput
            label='API Permissions'
            inputName='roles'
            options={sortApiRoles(availableRoles).map((role) => ({
              optionLabel: role.externalName,
              value: role.roleName,
            }))}
            rules={{
              required: 'Please select at least one API permission.',
            }}
          />

          <FormSubmitButton> Add API Key </FormSubmitButton>
        </form>
      </FormProvider>
      <div className='button-container'>
        <button
          type='button'
          className='transparent-button'
          onClick={() => {
            closeDialog();
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

function ShowApiKeySecrets({ keySecrets, closeDialog }: ApiKeySecretsProps) {
  const [showWarningDialog, setShowWarningDialog] = useState<boolean>(false);

  const secrets: Secret[] = [
    { value: keySecrets.secret, valueName: 'Secret' },
    { value: keySecrets.plaintextKey, valueName: 'Key' },
  ];

  const onCloseConfirmation = () => {
    closeDialog();
  };

  const onOpenChangeWarningDialog = () => {
    setShowWarningDialog(!showWarningDialog);
  };

  return (
    <div>
      <h1>API Key {keySecrets.name} Credentials</h1>
      <p>
        Copy the key and secret, store them in a secure location, and do not share them. When you
        close the window, these values are not saved and are no longer available to you. If they are
        lost, you&apos;ll need to create a new key.
      </p>
      {secrets.map((secret) => (
        <div key={secret.valueName}>
          <h2>{secret.valueName}</h2>
          <DisplaySecret secret={secret} />
        </div>
      ))}
      <div className='dialog-footer-section'>
        <button className='primary-button' type='button' onClick={onOpenChangeWarningDialog}>
          Close
        </button>
      </div>

      <div className='button-container'>
        {showWarningDialog && (
          <Dialog onOpenChange={onOpenChangeWarningDialog} closeButtonText='Cancel'>
            <p>
              Make sure you&apos;ve copied your API secret and key to a secure location. After you
              close this page, they are no longer accessible.
            </p>
            <div className='button-container'>
              <button onClick={onCloseConfirmation} className='primary-button' type='button'>
                Close
              </button>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}

function KeyCreationDialog({
  onKeyCreation,
  availableRoles,
  onOpenChange,
}: KeyCreationDialogProps) {
  const [keySecrets, setKeySecrets] = useState<KeySecretProp>(undefined);

  const onFormSubmit: SubmitHandler<CreateApiKeyFormDTO> = async (formData) => {
    setKeySecrets(await onKeyCreation(formData));
    InfoToast('Copy the credentials to a secure location before closing the page.');
  };

  return (
    <div className='key-creation-dialog'>
      <Dialog onOpenChange={onOpenChange} hideCloseButtons>
        {!keySecrets ? (
          <CreateApiKeyForm
            onFormSubmit={onFormSubmit}
            availableRoles={availableRoles}
            closeDialog={onOpenChange}
          />
        ) : (
          <ShowApiKeySecrets closeDialog={onOpenChange} keySecrets={keySecrets} />
        )}
      </Dialog>
    </div>
  );
}

export default KeyCreationDialog;
