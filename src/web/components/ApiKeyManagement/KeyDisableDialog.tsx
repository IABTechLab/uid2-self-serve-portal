import { FormProvider, useForm } from 'react-hook-form';

import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { Dialog } from '../Core/Dialog/Dialog';
import { TextInput } from '../Input/TextInput';

export type OnApiKeyDisable = (apiKey: ApiKeyDTO) => void;

type KeyDisableDialogProps = Readonly<{
  onDisable: OnApiKeyDisable;
  apiKey: ApiKeyDTO;
  onOpenChange: () => void;
}>;

function KeyDisableDialog({ onDisable, onOpenChange, apiKey }: KeyDisableDialogProps) {
  const onSubmit = () => {
    onDisable(apiKey);
  };

  const formMethods = useForm<ApiKeyDTO>({
    defaultValues: { disabled: true },
  });

  const { handleSubmit } = formMethods;

  return (
    <Dialog
      closeButtonText='Cancel'
      onOpenChange={onOpenChange}
      title={`Delete API Key: ${apiKey.name}`}
    >
      <p>
        Are you sure you want to delete your API key?{' '}
        <b>You will not be able to undo this action.</b>
        <br />
        <br />
        Type the Key ID to confirm: <b>{apiKey.key_id}</b>
      </p>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            inputName='Key Id'
            placeholder={apiKey.key_id}
            rules={{
              validate: (value) => {
                return value === apiKey.key_id
                  ? true
                  : `Please enter the Key ID to confirm disabling`;
              },
            }}
          />
          <FormSubmitButton>Delete Key</FormSubmitButton>
        </form>
      </FormProvider>
    </Dialog>
  );
}
export default KeyDisableDialog;
