import { useContext, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { UserRole } from '../../../api/entities/User';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { InviteTeamMemberForm, UserResponse } from '../../services/userAccount';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { SelectInput } from '../Input/SelectInput';
import { TextInput } from '../Input/TextInput';

type TeamMemberDialogProps = {
  onFormSubmit: (form: InviteTeamMemberForm, participantId: number) => Promise<void>;
  triggerButton: JSX.Element;
  person?: UserResponse;
};

function TeamMemberDialog({ onFormSubmit, triggerButton, person }: TeamMemberDialogProps) {
  const { participant } = useContext(ParticipantContext);
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<InviteTeamMemberForm> = async (formData) => {
    await onFormSubmit(formData, participant!.id!);
    setOpen(false);
  };

  return (
    <Dialog
      triggerButton={triggerButton}
      title={`${person ? 'Edit' : 'Add'} Team Member`}
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<InviteTeamMemberForm>
        onSubmit={onSubmit}
        submitButtonText='Save Team Member'
        defaultValues={person as InviteTeamMemberForm}
      >
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
          disabled={!!person}
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
      </Form>
    </Dialog>
  );
}

export default TeamMemberDialog;
