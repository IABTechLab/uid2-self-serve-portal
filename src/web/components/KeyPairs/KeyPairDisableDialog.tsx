import { useState } from 'react';

import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
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
      <Form onSubmit={onSubmit} submitButtonText='Delete Key' disableSubmitWhenInvalid>
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
      </Form>
    </Dialog>
  );
}
export default KeyPairDisableDialog;
