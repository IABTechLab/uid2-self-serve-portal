import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { EditKeyPairFormDTO } from '../../../api/services/adminServiceHelpers';
import { Dialog } from '../Core/Dialog';
import FormSubmitButton from '../Core/FormSubmitButton';
import { TextInput } from '../Input/TextInput';
import { validateUniqueKeyPairName } from './KeyPairHelper';
import { KeyPairModel } from './KeyPairModel';

import '../ApiKeyManagement/KeyEditDialog.scss';

export type OnKeyPairEdit = (
  form: EditKeyPairFormDTO,
  setKeyPair: React.Dispatch<React.SetStateAction<KeyPairModel>>
) => void;

type KeyPairEditDialogProps = Readonly<{
  onEdit: OnKeyPairEdit;
  triggerButton: JSX.Element;
  keyPair: KeyPairModel;
  existingKeyPairs: KeyPairModel[];
}>;

function KeyPairEditDialog({
  onEdit,
  triggerButton,
  keyPair: keyPairInitial,
  existingKeyPairs,
}: KeyPairEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [keyPair, setKeyPair] = useState<KeyPairModel>(keyPairInitial);

  const onSubmit = async (formData: EditKeyPairFormDTO) => {
    await onEdit(formData, setKeyPair);
    setOpen(false);
  };

  const defaultFormData: EditKeyPairFormDTO = {
    subscriptionId: keyPairInitial.subscriptionId,
    publicKey: keyPairInitial.publicKey,
    name: keyPairInitial.name,
    disabled: keyPairInitial.disabled,
  };

  const formMethods = useForm<EditKeyPairFormDTO>({
    defaultValues: defaultFormData,
  });
  const { handleSubmit } = formMethods;

  return (
    <div className='key-edit-dialog'>
      <Dialog
        closeButtonText='Cancel'
        open={open}
        onOpenChange={setOpen}
        triggerButton={triggerButton}
        title={`Edit Key Pair: ${keyPair.name}`}
      >
        <FormProvider<EditKeyPairFormDTO> {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              inputName='name'
              label='Name'
              rules={{
                required: 'Please specify a key pair name.',
                validate: (value: string) => validateUniqueKeyPairName(value, existingKeyPairs),
              }}
            />
            <TextInput inputName='subscriptionId' label='Subscription ID' disabled />
            <TextInput inputName='publicKey' label='Public Key' disabled />
            <FormSubmitButton buttonText='Save Key Pair' />
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}
export default KeyPairEditDialog;
