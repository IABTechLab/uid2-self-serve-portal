import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { AddKeyPairFormProps } from '../../services/keyPairService';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { FormStyledCheckbox } from '../Input/StyledCheckbox';
import { TextInput } from '../Input/TextInput';
import { KeyPairModel } from './KeyPairModel';

import './KeyPairDialog.scss';

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
    <div className='key-pair-dialog'>
      <Dialog
        triggerButton={props.triggerButton}
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
          <TextInput inputName='name' label='Name' />
          <div className='disabled-checkbox'>
            <FormStyledCheckbox name='disabled' />
            <span className='checkbox-label'>Disabled</span>
          </div>
        </Form>
      </Dialog>
    </div>
  );
}

export default KeyPairDialog;
