import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { UserRole } from '../../../api/entities/User';
import {
  InviteTeamMemberForm,
  UpdateTeamMemberForm,
  UserResponse,
} from '../../services/userAccount';
import { Dialog } from '../Core/Dialog';
import { SelectInput } from '../Input/SelectInput';
import { TextInput } from '../Input/TextInput';

type AddTeamMemberDialogProps = {
  onAddTeamMember: (form: InviteTeamMemberForm) => Promise<void>;
  triggerButton: JSX.Element;
  person?: never;
};
type UpdateTeamMemberDialogProps = {
  onUpdateTeamMember: (form: UpdateTeamMemberForm) => Promise<void>;
  triggerButton: JSX.Element;
  person: UserResponse;
};
type TeamMemberDialogProps = AddTeamMemberDialogProps | UpdateTeamMemberDialogProps;

const isUpdateTeamMemberDialogProps = (
  props: TeamMemberDialogProps
): props is UpdateTeamMemberDialogProps => 'person' in props;

function TeamMemberDialog(props: TeamMemberDialogProps) {
  const [open, setOpen] = useState(false);

  const formMethods = useForm<InviteTeamMemberForm>({
    defaultValues: props.person as InviteTeamMemberForm,
  });
  const { handleSubmit } = formMethods;

  const onSubmit = async (formData: InviteTeamMemberForm) => {
    if (isUpdateTeamMemberDialogProps(props)) {
      const { firstName, lastName, role } = formData;
      await props.onUpdateTeamMember({ firstName, lastName, role });
    } else {
      await props.onAddTeamMember(formData);
    }
    setOpen(false);
  };

  return (
    <Dialog
      triggerButton={props.triggerButton}
      title={`${props.person ? 'Edit' : 'Add'} Team Member`}
      closeButtonText='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            inputName='firstName'
            label='First Name'
            rules={{ required: 'Please specify first name.' }}
          />
          <TextInput
            inputName='lastName'
            label='Last Name'
            rules={{ required: 'Please specify last name.' }}
          />
          <TextInput
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
          />
          <SelectInput
            inputName='role'
            label='Job Function'
            rules={{ required: 'Please specify your job function.' }}
            options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
              optionLabel: UserRole[key],
              value: UserRole[key],
            }))}
          />
          <div className='form-footer'>
            <button type='submit' className='primary-button'>
              Save Team Member
            </button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default TeamMemberDialog;
