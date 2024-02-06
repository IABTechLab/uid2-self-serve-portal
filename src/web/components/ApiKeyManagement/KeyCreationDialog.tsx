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
import { StatusPopup } from '../Core/StatusPopup';
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
          label='API Roles'
          inputName='roles'
          options={sortApiRoles(availableRoles).map((role) => ({
            optionLabel: role.externalName,
            value: role.roleName,
          }))}
          rules={{
            required: 'Select at least one API role.',
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
        lost, you`ll need to create a new key.
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
            Make sure you have copied your API Secret and Key. These will not be accessible after
            this page is closed.
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
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [statusPopupMessage, setStatusPopupMessage] = useState<string>('');

  const showPopupMessage = (message: string) => {
    setStatusPopupMessage(message);
    setShowStatusPopup(true);
  };

  const onFormSubmit: SubmitHandler<CreateApiKeyFormDTO> = async (formData) => {
    setKeySecrets(await onKeyCreation(formData));
    showPopupMessage('Copy the credentials to a secure location before closing the page.');
  };

  const closeDialog = () => {
    setKeySecrets(undefined);
    setShowStatusPopup(false);
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

        {showStatusPopup && (
          <StatusPopup
            status='Info'
            show={showStatusPopup}
            setShow={setShowStatusPopup}
            message={statusPopupMessage}
            displayDuration={10000}
          />
        )}
      </Dialog>
    </div>
  );
}

export default KeyCreationDialog;
