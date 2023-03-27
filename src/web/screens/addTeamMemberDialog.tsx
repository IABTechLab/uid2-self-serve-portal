import { SubmitHandler } from 'react-hook-form';

import { UserRole } from '../../api/entities/User';
import Dialog from '../components/Core/Dialog';
import { Form } from '../components/Core/Form';
import { SelectInput } from '../components/Input/SelectInput';
import { TextInput } from '../components/Input/TextInput';
import { inviteTeamMember, InviteTeamMemberForm } from '../services/userAccount';

function AddTeamMemberDialog() {
  const onSubmitCallback = async () => {
    // await loadUser();
    // navigate('/account/pending');
  };
  const onSubmit: SubmitHandler<InviteTeamMemberForm> = async (formData) => {
    console.log(formData);
    await inviteTeamMember(formData);
    // return CreateParticipant(formData, LoggedInUser!.profile);
  };

  return (
    <Dialog triggerButton='Add team member' title='Add Team Member' closeButton='Cancel'>
      <Form<InviteTeamMemberForm> onSubmit={onSubmit} submitButtonText='Save Team Member'>
        <TextInput name='firstName' label='First Name' control={undefined} />
        <TextInput name='lastName' label='Last Name' control={undefined} />
        <TextInput name='email' label='email' control={undefined} />
        <SelectInput
          control={undefined}
          name='role'
          label='Job Function'
          options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
            optionLabel: UserRole[key],
            value: UserRole[key],
          }))}
        />
      </Form>
    </Dialog>
  );
}

export default AddTeamMemberDialog;
