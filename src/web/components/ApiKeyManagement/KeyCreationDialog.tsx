import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeySecretDTO } from '../../../api/services/apiKeyService';
import { ApiKeyCreationFormDTO } from '../../services/apiKeyService';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import KeySecretReveal from '../Core/KeySecretReveal';
import Popover from '../Core/Popover';
import { CheckboxInput } from '../Input/CheckboxInput';
import { TextInput } from '../Input/TextInput';

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
  const [secret, setSecret] = useState<KeySecretProp>(undefined);

  const onFormSubmit: SubmitHandler<ApiKeyCreationFormDTO> = async (formData) => {
    setSecret(await onKeyCreation(formData));
  };

  return (
    <Dialog triggerButton={triggerButton} open={open}>
      {!secret ? (
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
        </>
      ) : (
        <div>
          <h1>New Key: {secret.name}</h1>
          <p>
            Please copy the key and secret as they will not be saved after this window is closed.
            Keep these secrets in a secure location and do not share them with anyone. If the
            secrets are lost a new key will have be generated.
          </p>
          <KeySecretReveal title='Secret' value={secret.secret} />
          <KeySecretReveal title='Key' value={secret.plaintextKey} />
        </div>
      )}
    </Dialog>
  );
}

export default KeyCreationDialog;
