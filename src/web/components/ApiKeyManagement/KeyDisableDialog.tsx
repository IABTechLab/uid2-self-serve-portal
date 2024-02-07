import { useState } from 'react';

import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { TextInput } from '../Input/TextInput';

export type OnApiKeyDisable = (apiKey: ApiKeyDTO) => void;

type KeyDisableDialogProps = {
  onDisable: OnApiKeyDisable;
  triggerButton: JSX.Element;
  apiKey: ApiKeyDTO;
};

function KeyDisableDialog({ onDisable, triggerButton, apiKey }: KeyDisableDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit = () => {
    onDisable(apiKey);
    setOpen(false);
  };

  return (
    <Dialog
      closeButtonText='Cancel'
      open={open}
      onOpenChange={setOpen}
      triggerButton={triggerButton}
      title={`Disable ${apiKey.name}`}
    >
      <p>
        Are you sure you want to delete your Api key?{' '}
        <b>You will not be able to undo this action.</b>
        <br />
        <br />
        Type the Key ID to confirm: <b>{apiKey.key_id}</b>
      </p>
      <Form onSubmit={onSubmit} submitButtonText='Disable Key' disableSubmitWhenInvalid>
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
      </Form>
    </Dialog>
  );
}
export default KeyDisableDialog;
