import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { EditApiKeyFormDTO } from '../../services/apiKeyService';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';
import { TextInput } from '../Input/TextInput';

export type OnApiKeyEdit = (
  form: EditApiKeyFormDTO,
  setApiKey: React.Dispatch<React.SetStateAction<ApiKeyDTO>>,
  participantId?: number
) => void;

type KeyEditDialogProps = {
  onEdit: OnApiKeyEdit;
  triggerButton: JSX.Element;
  availableRoles: ApiRoleDTO[];
  apiKey: ApiKeyDTO;
  setApiKey: React.Dispatch<React.SetStateAction<ApiKeyDTO>>;
};

function KeyEditDialog({
  availableRoles,
  onEdit,
  triggerButton,
  apiKey,
  setApiKey,
}: KeyEditDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<EditApiKeyFormDTO> = async (formData) => {
    await onEdit(formData, setApiKey);
    setOpen(false);
  };

  const possibleRolesMap = new Map<number, ApiRoleDTO>();
  availableRoles.map((role) => possibleRolesMap.set(role.id, role));
  apiKey.roles.map((role) => possibleRolesMap.set(role.id, role));

  const defaultFormData: EditApiKeyFormDTO = {
    keyId: apiKey.key_id,
    newName: apiKey.name,
    newApiRoles: apiKey.roles.map((role) => role.roleName),
  };

  return (
    <Dialog
      closeButtonText='Cancel'
      open={open}
      onOpenChange={setOpen}
      triggerButton={triggerButton}
    >
      <Form<EditApiKeyFormDTO>
        onSubmit={onSubmit}
        defaultValues={defaultFormData}
        submitButtonText='Edit'
      >
        <TextInput inputName='newName' label='Name' required />
        <CheckboxInput
          label='API Roles'
          inputName='newApiRoles'
          options={Array.from(possibleRolesMap.values()).map((role) => ({
            optionLabel: role.externalName,
            value: role.roleName,
          }))}
          rules={{
            required: 'Please select at least one API Role.',
          }}
        />
      </Form>
    </Dialog>
  );
}
export default KeyEditDialog;
