import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

// import { UserRole } from '../../../api/entities/User';
import { AddKeyPairFormProps } from '../../services/keyPairService';
// import {
//   InviteTeamMemberForm,
//   UpdateTeamMemberForm,
//   UserResponse,
// } from '../../services/userAccount';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';
// import { SelectInput } from '../Input/SelectInput';
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

// const isUpdateTeamMemberDialogProps = (
//   props: KeyPairDialogProps
// ): props is UpdateTeamMemberDialogProps => 'person' in props;

function KeyPairDialog(props: KeyPairDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<AddKeyPairFormProps> = async (formData) => {
    // if (isUpdateTeamMemberDialogProps(props)) {
    //   const { firstName, lastName, role } = formData;
    //   await props.onUpdateTeamMember({ firstName, lastName, role });
    // } else {
    await props.onAddKeyPair(formData);
    // }
    setOpen(false);
  };

  return (
    <Dialog
      triggerButton={props.triggerButton}
      title='Add Key Pair'
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<AddKeyPairFormProps>
        onSubmit={onSubmit}
        submitButtonText='Save Team Member'
        defaultValues={props.keyPair}
      >
        <TextInput
          inputName='siteId'
          label='Site Id'
          rules={{ required: 'Please specify a Site Id.' }}
        />
        <CheckboxInput inputName='disabled' label='Disabled' options={} />
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
