import { faL } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeySecretDTO } from '../../../api/services/apiKeyService';
import { ApiKeyCreationFormDTO } from '../../services/apiKeyService';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import KeySecretReveal from '../Core/KeySecretReveal';
import { StatusPopup } from '../Core/StatusPopup';
import { CheckboxInput } from '../Input/CheckboxInput';
import { TextInput } from '../Input/TextInput';

import './KeyCreationDialog.scss';

type KeySecretProp = ApiKeySecretDTO | undefined;

type KeyCreationDialogProps = {
  onKeyCreation: (form: ApiKeyCreationFormDTO) => Promise<KeySecretProp>;
  triggerButton: JSX.Element;
  availableRoles: ApiRoleDTO[];
};

function KeyCreationDialog({
  onKeyCreation,
  triggerButton,
  availableRoles,
}: KeyCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [secrets, setSecrets] = useState<KeySecretProp>(undefined);
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [copiedSecrets, setCopiedSecrets] = useState<Map<String, boolean>>(
    new Map<String, boolean>()
  );

  const onFormSubmit: SubmitHandler<ApiKeyCreationFormDTO> = async (formData) => {
    setSecrets(await onKeyCreation(formData));
  };

  function confirmClose(): void {
    const values = [...copiedSecrets.values()];

    if (values.filter((value) => value === false).length > 0) {
      setShowStatusPopup(true);
      return;
    }

    setSecrets(undefined);
    setOpen(false);
  }

  return (
    <div className='key-creation-dialog'>
      <Dialog triggerButton={triggerButton} open={open} onOpenChange={setOpen} hideClose>
        {!secrets ? (
          <>
            <h1>Create API Key</h1>
            <Form<ApiKeyCreationFormDTO> onSubmit={onFormSubmit} submitButtonText='Create API Key'>
              <TextInput inputName='name' label='Name' required />
              <CheckboxInput
                label='API Roles'
                inputName='roles'
                options={availableRoles.map((role) => ({
                  optionLabel: role.externalName,
                  value: role.roleName,
                }))}
                rules={{ required: 'Your new API Key must have at least one role.' }}
              />
            </Form>
            <div className='cancel-container'>
              <button
                type='button'
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div>
            <h1>New Key: {secrets.name}</h1>
            <p>
              Please copy the key and secret as they will not be saved after this window is closed.
              Keep these secrets in a secure location and do not share them with anyone. If the
              secrets are lost a new key will have be generated.
            </p>
            <KeySecretReveal
              title='Secret'
              value={secrets.secret}
              setCopiedSecrets={setCopiedSecrets}
            />
            <KeySecretReveal
              title='Key'
              value={secrets.plaintextKey}
              setCopiedSecrets={setCopiedSecrets}
            />
            <div className='cancel-container'>
              <button type='button' onClick={confirmClose}>
                Close
              </button>
              {showStatusPopup && (
                <StatusPopup
                  status='Warning'
                  show={showStatusPopup}
                  setShow={setShowStatusPopup}
                  message='Please copy all secrets shown before closing the page'
                />
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default KeyCreationDialog;
