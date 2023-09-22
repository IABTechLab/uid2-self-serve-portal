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
// type UpdateKeyPairDialogProps = {
//   onUpdateTeamMember: (form: UpdateTeamMemberForm) => Promise<void>;
//   triggerButton: JSX.Element;
//   person: UserResponse;
// };
type KeyPairDialogProps = AddKeyPairDialogProps;

function KeyPairDialog(props: KeyPairDialogProps) {
  const [open, setOpen] = useState(false);
  const { keyPair, onAddKeyPair } = props;

  const onSubmit: SubmitHandler<AddKeyPairFormProps> = async (formData) => {
    // if (isUpdateTeamMemberDialogProps(props)) {
    //   const { firstName, lastName, role } = formData;
    //   await props.onUpdateTeamMember({ firstName, lastName, role });
    // } else {
    console.log(formData);
    await onAddKeyPair(formData);
    // }
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
        submitButtonText='Create'
        defaultValues={keyPair}
      >
        <TextInput inputName='name' label='Name' />
        <CheckboxInput
          inputName='disabled'
          label='Disabled'
          options={[{ optionLabel: '', value: false }]}
        />
        {/* <TextInput
          inputName='lastName'
          label='Last Name'
          rules={{ required: 'Please specify last name.' }}
        /> */}
        {/* <TextInput
          inputName='email'
          label='Email'
          disabled={!!props.person}
          rules={{
            required: 'Please specify email.',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Entered value does not match email format',
            },
          }}
        /> */}
        {/* <SelectInput
          inputName='role'
          label='Job Function'
          rules={{ required: 'Please specify your job function.' }}
          options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
            optionLabel: UserRole[key],
            value: UserRole[key],
          }))}
        /> */}
      </Form>
    </Dialog>
  );
}

export default KeyPairDialog;
