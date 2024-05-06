import { FormProvider, useForm } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { EditApiKeyFormDTO } from '../../services/apiKeyService';
import { sortApiRoles } from '../../utils/apiRoles';
import { Dialog } from '../Core/Dialog';
import FormSubmitButton from '../Core/FormSubmitButton';
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
  availableRoles: ApiRoleDTO[];
  apiKey: ApiKeyDTO;
  setApiKey: React.Dispatch<React.SetStateAction<ApiKeyDTO>>;
  onOpenChange: () => void;
}>;

function KeyEditDialog({
  availableRoles,
  onEdit,
  apiKey,
  setApiKey,
  onOpenChange,
}: KeyEditDialogProps) {
  const formMethods = useForm<EditApiKeyFormDTO>({
    defaultValues: {
      keyId: apiKey.key_id,
      newName: apiKey.name,
      newApiRoles: apiKey.roles.map((role) => role.roleName),
    },
  });
  const { handleSubmit } = formMethods;

  const onSubmit = async (formData: EditApiKeyFormDTO) => {
    onEdit(formData, setApiKey);
    onOpenChange();
  };

  const unapprovedRoles: ApiRoleDTO[] = getUnapprovedRoles(apiKey.roles, availableRoles);

  return (
    <div className='key-edit-dialog'>
      <Dialog
        closeButtonText='Cancel'
        onOpenChange={onOpenChange}
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
            <TextInput inputName='keyId' label='Key ID' disabled />
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
            <FormSubmitButton>Save Key</FormSubmitButton>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}
export default KeyEditDialog;
