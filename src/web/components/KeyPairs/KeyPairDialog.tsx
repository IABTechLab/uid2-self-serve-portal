import { FormProvider, useForm } from 'react-hook-form';

import { AddKeyPairFormProps } from '../../services/keyPairService';
import { Dialog } from '../Core/Popups/Dialog';
import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { TextInput } from '../Input/TextInput';
import { validateUniqueKeyPairName } from './KeyPairHelper';
import { KeyPairModel } from './KeyPairModel';

import './KeyPairDialog.scss';

type AddKeyPairDialogProps = Readonly<{
  onSubmitKeyPair: (form: AddKeyPairFormProps) => void;
  keyPair?: KeyPairModel;
  existingKeyPairs: KeyPairModel[] | undefined;
  onOpenChange: () => void;
}>;

type KeyPairDialogProps = AddKeyPairDialogProps;

function KeyPairDialog({
  onSubmitKeyPair,
  keyPair,
  existingKeyPairs,
  onOpenChange,
}: KeyPairDialogProps) {
  const formMethods = useForm<AddKeyPairFormProps>({
    defaultValues: { name: keyPair?.name },
  });
  const { handleSubmit } = formMethods;

  const onSubmit = (formData: AddKeyPairFormProps) => {
    onSubmitKeyPair(formData);
  };

  return (
    <div className='key-pair-dialog'>
      <Dialog title='Add Key Pair' closeButtonText='Cancel' onOpenChange={onOpenChange}>
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
            <FormSubmitButton>Add Key Pair </FormSubmitButton>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default KeyPairDialog;
