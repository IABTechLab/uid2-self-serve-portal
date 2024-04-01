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
  updateKeyPair: React.Dispatch<React.SetStateAction<KeyPairModel>>
) => void;

type KeyPairEditDialogProps = Readonly<{
  onEdit: OnKeyPairEdit;
  triggerButton: JSX.Element;
  keyPair: KeyPairModel;
  updateKeyPair: React.Dispatch<React.SetStateAction<KeyPairModel>>;
}>;

function KeyPairEditDialog({
  onEdit,
  triggerButton,
  keyPair,
  updateKeyPair,
}: KeyPairEditDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<EditKeyPairFormDTO> = async (formData) => {
    await onEdit(formData, updateKeyPair);
    setOpen(false);
  };

  const defaultFormData: EditKeyPairFormDTO = {
    subscriptionId: keyPair.subscriptionId,
    name: keyPair.name,
    disabled: keyPair.disabled,
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
          submitButtonText='Save Key'
        >
          <TextInput inputName='name' label='Name' />
        </Form>
      </Dialog>
    </div>
  );
}
export default KeyPairEditDialog;
