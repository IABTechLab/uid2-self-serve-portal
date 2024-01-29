import { useState } from 'react';

import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { TextInput } from '../Input/TextInput';

export type OnApiKeyDisable = (
  apiKey: ApiKeyDTO,
  setApiKey: React.Dispatch<React.SetStateAction<ApiKeyDTO>>
) => void;

type KeyDisableDialogProps = {
  onDisable: OnApiKeyDisable;
  triggerButton: JSX.Element;
  apiKey: ApiKeyDTO;
  setApiKey: React.Dispatch<React.SetStateAction<ApiKeyDTO>>;
};

function KeyDisableDialog({ onDisable, triggerButton, apiKey, setApiKey }: KeyDisableDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit = () => {
    onDisable(apiKey, setApiKey);
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
        Are you sure you want to delete your Api Key. <b>This action can not be undone.</b>
        <br />
        <br />
        Type the Key ID to confirm: <b>{apiKey.key_id}</b>
      </p>
      <Form onSubmit={onSubmit} submitButtonText='Disable Key'>
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
