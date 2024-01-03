import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { KeyCreationFormProps } from '../../services/apiKeyService';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';
import { TextInput } from '../Input/TextInput';

type KeyCreationDialogProps = {
  onKeyCreation: (form: KeyCreationFormProps) => Promise<void>;
  triggerButton: JSX.Element;
  availableRoles: ApiRoleDTO[];
};

function KeyCreationDialog({
  onKeyCreation,
  triggerButton,
  availableRoles,
}: KeyCreationDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<KeyCreationFormProps> = async (formData) => {
    await onKeyCreation(formData);
    setOpen(false);
  };

  return (
    <Dialog
      triggerButton={triggerButton}
      title='Create API Key'
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<KeyCreationFormProps> onSubmit={onSubmit} submitButtonText='Create API Key'>
        <TextInput inputName='name' label='Name' required />
        <CheckboxInput
          label='API Roles'
          inputName='Roles'
          options={availableRoles.map((role) => ({
            optionLabel: role.externalName,
            value: role.id,
          }))}
        />
      </Form>
    </Dialog>
  );
}

export default KeyCreationDialog;
