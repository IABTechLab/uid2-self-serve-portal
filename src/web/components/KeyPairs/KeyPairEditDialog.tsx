import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { EditKeyPairFormDTO } from '../../../api/services/adminServiceHelpers';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { TextInput } from '../Input/TextInput';
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
}>;

function KeyPairEditDialog({
  onEdit,
  triggerButton,
  keyPair: keyPairInitial,
}: KeyPairEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [keyPair, setKeyPair] = useState<KeyPairModel>(keyPairInitial);

  const onSubmit: SubmitHandler<EditKeyPairFormDTO> = async (formData) => {
    await onEdit(formData, setKeyPair);
    setOpen(false);
  };

  const defaultFormData: EditKeyPairFormDTO = {
    subscriptionId: keyPairInitial.subscriptionId,
    name: keyPairInitial.name,
    disabled: keyPairInitial.disabled,
  };

  return (
    <div className='key-edit-dialog'>
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
            rules={{ required: 'Please specify a key pair name.' }}
          />
        </Form>
      </Dialog>
    </div>
  );
}
export default KeyPairEditDialog;
