import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeySecretsDTO } from '../../../api/services/apiKeyService';
import { CreateApiKeyFormDTO } from '../../services/apiKeyService';
import { sortApiRoles } from '../../utils/apiRoles';
import { Secret } from '../Core/CopySecretButton';
import { Dialog } from '../Core/Dialog';
import DisplaySecret from '../Core/DisplaySecret';
import { Form } from '../Core/Form';
import { InfoToast } from '../Core/Toast';
import { CheckboxInput } from '../Input/CheckboxInput';
import { TextInput } from '../Input/TextInput';

import './KeyCreationDialog.scss';

type KeySecretProp = ApiKeySecretsDTO | undefined;

type KeyCreationDialogProps = {
  onKeyCreation: (form: CreateApiKeyFormDTO) => Promise<KeySecretProp>;
  triggerButton: JSX.Element;
  availableRoles: ApiRoleDTO[];
};

function CreateApiKeyForm({
  onFormSubmit,
  availableRoles,
  closeDialog,
}: {
  onFormSubmit: SubmitHandler<CreateApiKeyFormDTO>;
  availableRoles: ApiRoleDTO[];
  closeDialog: () => void;
}) {
  return (
    <>
      <h1>Create API Key</h1>
      <Form<CreateApiKeyFormDTO> onSubmit={onFormSubmit} submitButtonText='Create API Key'>
        <TextInput inputName='name' label='Name' required />
        <CheckboxInput
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
      </Form>
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

function ShowApiKeySecrets({
  keySecrets,
  closeDialog,
}: {
  keySecrets: ApiKeySecretsDTO;
  closeDialog: () => void;
}) {
  const secrets: Secret[] = [
    { value: keySecrets.secret, valueName: 'Secret' },
    { value: keySecrets.plaintextKey, valueName: 'Key' },
  ];

  const [open, setOpen] = useState(false);

  const onCloseConfirmation = () => {
    closeDialog();
    setOpen(false);
  };

  const triggerButton: JSX.Element = (
    <button className='primary-button' type='button'>
      Close
    </button>
  );

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

      <div className='button-container'>
        <Dialog
          triggerButton={triggerButton}
          open={open}
          onOpenChange={setOpen}
          closeButtonText='Cancel'
        >
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
      </div>
    </div>
  );
}

function KeyCreationDialog({
  onKeyCreation,
  triggerButton,
  availableRoles,
}: KeyCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [keySecrets, setKeySecrets] = useState<KeySecretProp>(undefined);

  const onFormSubmit: SubmitHandler<CreateApiKeyFormDTO> = async (formData) => {
    setKeySecrets(await onKeyCreation(formData));
    InfoToast('Copy the credentials to a secure location before closing the page.');
  };

  const closeDialog = () => {
    setKeySecrets(undefined);
    setOpen(false);
  };

  return (
    <div className='key-creation-dialog'>
      <Dialog triggerButton={triggerButton} open={open} onOpenChange={setOpen} hideCloseButtons>
        {!keySecrets ? (
          <CreateApiKeyForm
            onFormSubmit={onFormSubmit}
            availableRoles={availableRoles}
            closeDialog={closeDialog}
          />
        ) : (
          <ShowApiKeySecrets closeDialog={closeDialog} keySecrets={keySecrets} />
        )}
      </Dialog>
    </div>
  );
}

export default KeyCreationDialog;
