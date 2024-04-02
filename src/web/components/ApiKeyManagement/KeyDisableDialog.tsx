import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { Dialog } from '../Core/Dialog';
import { TextInput } from '../Input/TextInput';

export type OnApiKeyDisable = (apiKey: ApiKeyDTO) => void;

type KeyDisableDialogProps = Readonly<{
  onDisable: OnApiKeyDisable;
  triggerButton: JSX.Element;
  apiKey: ApiKeyDTO;
}>;

function KeyDisableDialog({ onDisable, triggerButton, apiKey }: KeyDisableDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit = () => {
    onDisable(apiKey);
    setOpen(false);
  };

  const formMethods = useForm<ApiKeyDTO>({
    defaultValues: { disabled: true },
  });

  const { handleSubmit } = formMethods;

  return (
    <Dialog
      closeButtonText='Cancel'
      open={open}
      onOpenChange={setOpen}
      triggerButton={triggerButton}
      title={`Delete ${apiKey.name}`}
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
          <div className='form-footer'>
            <button type='submit' className='primary-button'>
              Delete Key
            </button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}
export default KeyDisableDialog;
