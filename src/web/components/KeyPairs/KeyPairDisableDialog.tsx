import { FormProvider, useForm } from 'react-hook-form';

import { Dialog } from '../Core/Dialog';
import FormSubmitButton from '../Core/FormSubmitButton';
import { TextInput } from '../Input/TextInput';
import { KeyPairModel } from './KeyPairModel';

export type OnKeyPairDisable = (keyPair: KeyPairModel) => void;

type KeyPairDisableDialogProps = {
  onDisable: OnKeyPairDisable;
  keyPair: KeyPairModel;
  onOpenChange: () => void;
};

function KeyPairDisableDialog({ onDisable, keyPair, onOpenChange }: KeyPairDisableDialogProps) {
  const onSubmit = () => {
    onDisable(keyPair);
    onOpenChange();
  };

  const formMethods = useForm<KeyPairModel>({
    defaultValues: keyPair,
  });
  const { handleSubmit } = formMethods;

  return (
    <Dialog
      closeButtonText='Cancel'
      open
      onOpenChange={onOpenChange}
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
            inputName='Subscription ID'
            placeholder={keyPair.subscriptionId}
            rules={{
              validate: (value) => {
                return value === keyPair.subscriptionId
                  ? true
                  : `Please enter the Subscription ID to confirm disabling`;
              },
            }}
          />
          <FormSubmitButton>Delete Key Pair</FormSubmitButton>
        </form>
      </FormProvider>
    </Dialog>
  );
}
export default KeyPairDisableDialog;
