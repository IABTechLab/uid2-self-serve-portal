import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { EditKeyPairFormDTO } from '../../../api/services/adminServiceHelpers';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
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

  const onSubmit: SubmitHandler<EditKeyPairFormDTO> = async (formData) => {
    if (formData.name !== keyPairInitial.name) {
      await onEdit(formData, setKeyPair);
    }
    setOpen(false);
  };

  const defaultFormData: EditKeyPairFormDTO = {
    subscriptionId: keyPairInitial.subscriptionId,
    publicKey: keyPairInitial.publicKey,
    name: keyPairInitial.name,
    disabled: keyPairInitial.disabled,
  };

  return (
    <Dialog
      closeButtonText='Cancel'
      open={open}
      onOpenChange={setOpen}
      triggerButton={triggerButton}
      title={`Edit Key Pair: ${keyPair.name}`}
    >
      <Form<EditKeyPairFormDTO>
        onSubmit={onSubmit}
        defaultValues={defaultFormData}
        submitButtonText='Save Key Pair'
      >
        <TextInput
          inputName='name'
          label='Name'
          rules={{
            required: 'Please specify key pair name.',
            validate: (value: string) =>
              validateUniqueKeyPairName(
                value,
                existingKeyPairs.filter((kp) => ![keyPairInitial].includes(kp))
              ),
          }}
        />
        <TextInput inputName='subscriptionId' label='Subscription ID' disabled />
        <TextInput inputName='publicKey' label='Public Key' disabled />
      </Form>
    </Dialog>
  );
}
export default KeyPairEditDialog;
