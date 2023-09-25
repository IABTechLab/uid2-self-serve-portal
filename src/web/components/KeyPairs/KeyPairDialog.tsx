import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { AddKeyPairFormProps } from '../../services/keyPairService';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';
import { TextInput } from '../Input/TextInput';
import { KeyPairModel } from './KeyPairModel';

type AddKeyPairDialogProps = {
  onAddKeyPair: (form: AddKeyPairFormProps) => Promise<void>;
  triggerButton: JSX.Element;
  keyPair?: KeyPairModel;
};

type KeyPairDialogProps = AddKeyPairDialogProps;

function KeyPairDialog(props: KeyPairDialogProps) {
  const [open, setOpen] = useState(false);
  const { keyPair, onAddKeyPair } = props;

  const onSubmit: SubmitHandler<AddKeyPairFormProps> = async (formData) => {
    await onAddKeyPair(formData);
    setOpen(false);
  };

  return (
    <Dialog
      triggerButton={props.triggerButton}
      title='Create Key Pair'
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<AddKeyPairFormProps>
        onSubmit={onSubmit}
        submitButtonText='Create Key Pair'
        defaultValues={keyPair}
      >
        <TextInput inputName='name' label='Name' />
        <CheckboxInput
          inputName='disabled'
          label='Disabled'
          options={[{ optionLabel: '', value: false }]}
        />
      </Form>
    </Dialog>
  );
}

export default KeyPairDialog;
