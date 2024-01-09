import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeySecretsDTO } from '../../../api/services/apiKeyService';
import { CreateApiKeyFormDTO } from '../../services/apiKeyService';
import { Dialog } from '../Core/Dialog';
import DisplaySecret, { Secret } from '../Core/DisplaySecret';
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
          options={availableRoles.map((role) => ({
            optionLabel: role.externalName,
            value: role.roleName,
          }))}
          rules={{
            required: 'Please select at least one API Role.',
          }}
        />
      </Form>
      <div className='cancel-container'>
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
  showPopupMessage,
}: {
  keySecrets: ApiKeySecretsDTO;
  closeDialog: () => void;
  showPopupMessage: (message: string) => void;
}) {
  const secrets: Secret[] = [
    { value: keySecrets.secret, valueName: 'Secret' },
    { value: keySecrets.plaintextKey, valueName: 'Key' },
  ];

  const [uncopiedValueNames, setUncopiedValueNames] = useState(
    secrets.map((secret) => secret.valueName)
  );

  const onCopyGenerator = (copiedValueName: String) => {
    return () => {
      setUncopiedValueNames((oldUncopiedValueNames: string[]) => {
        return oldUncopiedValueNames.filter((valueName) => valueName !== copiedValueName);
      });
    };
  };

  const onClose = () => {
    if (uncopiedValueNames.length > 0) {
      showPopupMessage('Please copy all secrets shown before closing the page');
      return;
    }

    closeDialog();
  };

  return (
    <div>
      <h1>{keySecrets.name} Secrets</h1>
      <p>
        Please copy the key and secret as they will not be saved after this window is closed. Keep
        these secrets in a secure location and do not share them with anyone. If the secrets are
        lost a new key will have to be generated.
      </p>
      {secrets.map((secret) => (
        <div key={secret.valueName}>
          <h2>{secret.valueName}</h2>
          <DisplaySecret secret={secret} onCopy={onCopyGenerator(secret.valueName)} />
        </div>
      ))}
      <div className='cancel-container'>
        <button type='button' className='transparent-button' onClick={onClose}>
          Close
        </button>
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
    showPopupMessage(
      'Your key has been created. Please copy the credentials before closing the window.'
    );
  };

  const closeDialog = () => {
    setKeySecrets(undefined);
    setShowStatusPopup(false);
    setOpen(false);
  };

  return (
    <div className='key-creation-dialog'>
      <Dialog triggerButton={triggerButton} open={open} onOpenChange={setOpen} hideClose>
        {!keySecrets ? (
          <CreateApiKeyForm
            onFormSubmit={onFormSubmit}
            availableRoles={availableRoles}
            closeDialog={closeDialog}
          />
        ) : (
          <ShowApiKeySecrets
            closeDialog={closeDialog}
            keySecrets={keySecrets}
            showPopupMessage={showPopupMessage}
          />
        )}

        {showStatusPopup && (
          <StatusPopup
            status='Info'
            show={showStatusPopup}
            setShow={setShowStatusPopup}
            message={statusPopupMessage}
          />
        )}
      </Dialog>
    </div>
  );
}

export default KeyCreationDialog;
