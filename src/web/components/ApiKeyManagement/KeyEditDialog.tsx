import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { EditApiKeyFormDTO } from '../../services/apiKeyService';
import { sortApiRoles } from '../../utils/apiRoles';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';
import { TextInput } from '../Input/TextInput';
import { getUnapprovedRoles } from './KeyEditDialogHelper';

import './KeyEditDialog.scss';

export type OnApiKeyEdit = (
  form: EditApiKeyFormDTO,
  setApiKey: React.Dispatch<React.SetStateAction<ApiKeyDTO>>
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

  const defaultFormData: EditApiKeyFormDTO = {
    keyId: apiKey.key_id,
    newName: apiKey.name,
    newApiRoles: apiKey.roles.map((role) => role.roleName),
  };

  const unapprovedRoles: ApiRoleDTO[] = getUnapprovedRoles(apiKey.roles, availableRoles);

  return (
    <div className='key-edit-dialog'>
      <Dialog
        closeButtonText='Cancel'
        open={open}
        onOpenChange={setOpen}
        triggerButton={triggerButton}
        title={`Edit ${apiKey.name}`}
      >
        <Form<EditApiKeyFormDTO>
          onSubmit={onSubmit}
          defaultValues={defaultFormData}
          submitButtonText='Save Key'
        >
          <TextInput inputName='newName' label='Name' required />
          <CheckboxInput
            label='API Permissions'
            inputName='newApiRoles'
            options={sortApiRoles(availableRoles.concat(unapprovedRoles)).map((role) => ({
              optionLabel: role.externalName,
              value: role.roleName,
            }))}
            rules={{
              required: 'Please select at least one API permission.',
            }}
          />
          {unapprovedRoles.length > 0 && (
            <div className='unapproved-roles-message'>
              You do not have permission for:
              <ul>
                {unapprovedRoles.map((role) => (
                  <li key={`Role-${role.id}`}>{role.externalName}</li>
                ))}
              </ul>
              If you remove any of these permission(s) from the key, you will not be able to undo
              this action.
            </div>
          )}
        </Form>
      </Dialog>
    </div>
  );
}
export default KeyEditDialog;
