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

import './addTeamMemberDialog.scss';

type AddTeamMemberProps = {
  onAddTeamMember: () => void;
};

function AddTeamMemberDialog({ onAddTeamMember }: AddTeamMemberProps) {
  const { participant } = useContext(ParticipantContext);
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<InviteTeamMemberForm> = async (formData) => {
    await InviteTeamMember(formData, participant!.id!);
    setOpen(false);
    onAddTeamMember();
  };

  return (
    <Dialog
      triggerButton={
        <button className='small-button' type='button'>
          Add team member
        </button>
      }
      title='Add Team Member'
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <div className='addTeamMemberDialog'>
        <Form<InviteTeamMemberForm> onSubmit={onSubmit} submitButtonText='Save Team Member'>
          <TextInput
            inputName='firstName'
            label='First Name'
            className='addTeamMemberDialogInput'
            rules={{ required: 'Please specify first name.' }}
          />
          <TextInput
            inputName='lastName'
            label='Last Name'
            rules={{ required: 'Please specify last name.' }}
            className='addTeamMemberDialogInput'
          />
          <TextInput
            inputName='email'
            label='Email'
            rules={{
              required: 'Please specify email.',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format',
              },
            }}
            className='addTeamMemberDialogInput'
          />
          <SelectInput
            inputName='role'
            label='Job Function'
            rules={{ required: 'Please specify your job function.' }}
            options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
              optionLabel: UserRole[key],
              value: UserRole[key],
            }))}
            className='addTeamMemberDialogDropdown'
          />
          <CheckboxInput
            inputName='agreement'
            rules={{ validate: (value) => (value && value[0]) || 'Please accept the agreement ' }}
            options={[
              {
                optionLabel:
                  'By checking this box I agree that I am responsible for managing this Team Member in this Platform.',
                value: true,
              },
            ]}
          />
        </Form>
      </div>
    </Dialog>
  );
}

export default AddTeamMemberDialog;
