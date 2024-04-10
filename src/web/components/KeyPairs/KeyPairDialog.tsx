import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { AddKeyPairFormProps } from '../../services/keyPairService';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { TextInput } from '../Input/TextInput';
import { validateUniqueKeyPairName } from './KeyPairHelper';
import { KeyPairModel } from './KeyPairModel';

import './KeyPairDialog.scss';

type AddKeyPairDialogProps = {
  onAddKeyPair: (form: AddKeyPairFormProps) => Promise<void>;
  triggerButton: JSX.Element;
  keyPair?: KeyPairModel;
  existingKeyPairs: KeyPairModel[] | undefined;
};

type KeyPairDialogProps = AddKeyPairDialogProps;

function KeyPairDialog({
  onAddKeyPair,
  triggerButton,
  keyPair,
  existingKeyPairs,
}: KeyPairDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<AddKeyPairFormProps> = async (formData) => {
    await onAddKeyPair(formData);
    setOpen(false);
  };

  return (
    <div className='key-pair-dialog'>
      <Dialog
        triggerButton={triggerButton}
        title='Create Key Pair'
        closeButtonText='Cancel'
        open={open}
        onOpenChange={setOpen}
      >
        <Form<AddKeyPairFormProps>
          onSubmit={onSubmit}
          submitButtonText='Create Key Pair'
          defaultValues={keyPair}
        >
          <TextInput
            inputName='name'
            label='Name'
            rules={{
              required: 'Please specify key pair name.',
              validate: (value: string) => validateUniqueKeyPairName(value, existingKeyPairs),
            }}
          />
        </Form>
      </Dialog>
    </div>
  );
}

export default KeyPairDialog;
