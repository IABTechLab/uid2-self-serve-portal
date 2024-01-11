import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { EditApiKeyFormDTO } from '../../services/apiKeyService';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';
import { TextInput } from '../Input/TextInput';

type KeyEditDialogProps = {
  onEdit: (form: EditApiKeyFormDTO) => Promise<void>;
  triggerButton: JSX.Element;
  availableRoles: ApiRoleDTO[];
  apiKey: ApiKeyDTO;
};

function KeyEditDialog({ availableRoles, onEdit, triggerButton, apiKey }: KeyEditDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<EditApiKeyFormDTO> = async (formData) => {
    await onEdit(formData);
    setOpen(false);
  };

  const possibleRolesMap = new Map<number, ApiRoleDTO>();
  availableRoles.map((role) => possibleRolesMap.set(role.id, role));
  apiKey.roles.map((role) => possibleRolesMap.set(role.id, role));

  const defaultFormData: EditApiKeyFormDTO = {
    name: apiKey.name,
    roles: apiKey.roles.map((role) => role.roleName),
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
        <TextInput inputName='name' label='Name' required />
        <CheckboxInput
          label='API Roles'
          inputName='roles'
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
