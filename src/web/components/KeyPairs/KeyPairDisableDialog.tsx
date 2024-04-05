import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Dialog } from '../Core/Dialog';
import { TextInput } from '../Input/TextInput';
import { KeyPairModel } from './KeyPairModel';

export type OnKeyPairDisable = (keyPair: KeyPairModel) => void;

type KeyPairDisableDialogProps = {
  onDisable: OnKeyPairDisable;
  triggerButton: JSX.Element;
  keyPair: KeyPairModel;
};

function KeyPairDisableDialog({ onDisable, triggerButton, keyPair }: KeyPairDisableDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit = () => {
    onDisable(keyPair);
    setOpen(false);
  };

  const formMethods = useForm<KeyPairModel>({
    defaultValues: keyPair,
  });
  const { handleSubmit } = formMethods;

  return (
    <Dialog
      closeButtonText='Cancel'
      open={open}
      onOpenChange={setOpen}
      triggerButton={triggerButton}
      title={`Delete Key Pair: ${keyPair.name}`}
    >
      <p>
        Are you sure you want to delete your key pair?{' '}
        <b>You will not be able to undo this action.</b>
        <br />
        <br />
        Type the Subscription ID to confirm: <b>{keyPair.subscriptionId}</b>
      </p>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            inputName='Subscription Id'
            placeholder={keyPair.subscriptionId}
            rules={{
              validate: (value) => {
                return value === keyPair.subscriptionId
                  ? true
                  : `Please enter the Subscription ID to confirm disabling`;
              },
            }}
          />
          <div className='form-footer'>
            <button type='submit' className='primary-button'>
              Delete Key Pair
            </button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}
export default KeyPairDisableDialog;