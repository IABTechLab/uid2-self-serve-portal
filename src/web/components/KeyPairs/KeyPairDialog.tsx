import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { AddKeyPairFormProps } from '../../services/keyPairService';
import { Dialog } from '../Core/Dialog';
import { TextInput } from '../Input/TextInput';
import { KeyPairModel } from './KeyPairModel';

import './KeyPairDialog.scss';

type AddKeyPairDialogProps = Readonly<{
  onAddKeyPair: (form: AddKeyPairFormProps) => Promise<void>;
  triggerButton: JSX.Element;
  keyPair?: KeyPairModel;
}>;

function KeyPairDialog({ onAddKeyPair, triggerButton, keyPair }: AddKeyPairDialogProps) {
  const [open, setOpen] = useState(false);

  const formMethods = useForm<AddKeyPairFormProps>({
    defaultValues: { name: keyPair?.name },
  });
  const { handleSubmit } = formMethods;

  const onSubmit = async (formData: AddKeyPairFormProps) => {
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
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              inputName='name'
              label='Name'
              rules={{ required: 'Please specify a key pair name.' }}
            />
            <div className='form-footer'>
              <button type='submit' className='primary-button'>
                Approve Participant
              </button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default KeyPairDialog;
