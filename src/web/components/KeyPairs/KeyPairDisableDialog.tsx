import { FormProvider, useForm } from 'react-hook-form';

import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { Dialog } from '../Core/Dialog/Dialog';
import { TextInput } from '../Input/TextInput';
import { KeyPairModel } from './KeyPairModel';

export type OnKeyPairDisable = (keyPair: KeyPairModel) => void;

type KeyPairDisableDialogProps = Readonly<{
  onDisable: OnKeyPairDisable;
  keyPair: KeyPairModel;
  onOpenChange: () => void;
}>;

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
                  : `To confirm deletion, provide the Subscription ID. You can copy and paste the value.`;
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
