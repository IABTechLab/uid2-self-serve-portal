import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { EditApiKeyFormDTO } from '../../services/apiKeyService';
import { sortApiRoles } from '../../utils/apiRoles';
import { Dialog } from '../Core/Dialog';
import { MultiCheckboxInput } from '../Input/MultiCheckboxInput';
import { TextInput } from '../Input/TextInput';
import { getUnapprovedRoles } from './KeyEditDialogHelper';

import './KeyEditDialog.scss';

export type OnApiKeyEdit = (
  form: EditApiKeyFormDTO,
  setApiKey: React.Dispatch<React.SetStateAction<ApiKeyDTO>>
) => void;

type KeyEditDialogProps = Readonly<{
  onEdit: OnApiKeyEdit;
  triggerButton: JSX.Element;
  availableRoles: ApiRoleDTO[];
  apiKey: ApiKeyDTO;
  setApiKey: React.Dispatch<React.SetStateAction<ApiKeyDTO>>;
}>;

function KeyEditDialog({
  availableRoles,
  onEdit,
  triggerButton,
  apiKey,
  setApiKey,
}: KeyEditDialogProps) {
  const [open, setOpen] = useState(false);

  const formMethods = useForm<EditApiKeyFormDTO>({
    defaultValues: {
      keyId: apiKey.key_id,
      newName: apiKey.name,
      newApiRoles: apiKey.roles.map((role) => role.roleName),
    },
  });
  const { handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<EditApiKeyFormDTO> = async (formData) => {
    onEdit(formData, setApiKey);
    setOpen(false);
  };

  const unapprovedRoles: ApiRoleDTO[] = getUnapprovedRoles(apiKey.roles, availableRoles);

  return (
    <div className='key-edit-dialog'>
      <Dialog
        closeButtonText='Cancel'
        open={open}
        onOpenChange={setOpen}
        triggerButton={triggerButton}
        title={`Edit API Key: ${apiKey.name}`}
      >
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              inputName='newName'
              label='Name'
              rules={{
                required: 'Please specify an API Key name.',
              }}
            />
            <MultiCheckboxInput
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
                If you remove any of these permissions from the key, you will not be able to undo
                this action.
              </div>
            )}
            <div className='form-footer'>
              <button type='submit' className='primary-button'>
                Save Key
              </button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}
export default KeyEditDialog;
