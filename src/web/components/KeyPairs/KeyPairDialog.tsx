import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { AddKeyPairFormProps } from '../../services/keyPairService';
import { Dialog } from '../Core/Dialog';
import FormSubmitButton from '../Core/FormSubmitButton';
import { TextInput } from '../Input/TextInput';
import { validateUniqueKeyPairName } from './KeyPairHelper';
import { KeyPairModel } from './KeyPairModel';

import './KeyPairDialog.scss';

type AddKeyPairDialogProps = Readonly<{
  onAddKeyPair: (form: AddKeyPairFormProps) => Promise<void>;
  triggerButton: JSX.Element;
  keyPair?: KeyPairModel;
  existingKeyPairs: KeyPairModel[] | undefined;
}>;

type KeyPairDialogProps = AddKeyPairDialogProps;

function KeyPairDialog({
  onAddKeyPair,
  triggerButton,
  keyPair,
  existingKeyPairs,
}: KeyPairDialogProps) {
  const [open, setOpen] = useState(false);

  const formMethods = useForm<AddKeyPairFormProps>({
    defaultValues: { name: keyPair?.name },
  });
  const { handleSubmit, setValue, reset } = formMethods;

  useEffect(() => {
    if (!open) {
      setValue('name', '');
      reset();
    }
  }, [open, setValue, reset]);

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
              rules={{
                required: 'Please specify a key pair name.',
                validate: (value: string) => validateUniqueKeyPairName(value, existingKeyPairs),
              }}
            />
            <FormSubmitButton buttonText='Add Key Pair' />
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default KeyPairDialog;
