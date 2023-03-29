import { useContext, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { UserRole } from '../../api/entities/User';
import { Dialog } from '../components/Core/Dialog';
import { Form } from '../components/Core/Form';
import { CheckboxInput } from '../components/Input/CheckboxInput';
import { SelectInput } from '../components/Input/SelectInput';
import { TextInput } from '../components/Input/TextInput';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { InviteTeamMember, InviteTeamMemberForm } from '../services/participant';

function AddTeamMemberDialog() {
  const { participant } = useContext(ParticipantContext);
  const [open, setOpen] = useState(false);

  const onSubmitCallback = () => setOpen(false);
  const onSubmit: SubmitHandler<InviteTeamMemberForm> = async (formData) => {
    await InviteTeamMember(formData, participant!.id!);
  };

  return (
    <Dialog
      triggerButton='Add team member'
      title='Add Team Member'
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<InviteTeamMemberForm>
        onSubmit={onSubmit}
        submitButtonText='Save Team Member'
        onSubmitCallback={onSubmitCallback}
      >
        <TextInput name='firstName' label='First Name' control={undefined} />
        <TextInput name='lastName' label='Last Name' control={undefined} />
        <TextInput name='email' label='email' control={undefined} />
        <SelectInput
          control={undefined}
          name='jobFunction'
          label='Job Function'
          options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
            optionLabel: UserRole[key],
            value: UserRole[key],
          }))}
        />
        <CheckboxInput
          name='agreement'
          control={undefined}
          options={[
            {
              optionLabel:
                'By checking this box I agree that I am responsible for managing this Team Member in this Platform.',
              value: true,
            },
          ]}
        />
      </Form>
    </Dialog>
  );
}

export default AddTeamMemberDialog;
