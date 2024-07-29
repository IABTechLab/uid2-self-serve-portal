import { FormProvider, useForm } from 'react-hook-form';

import { JobFunction, UserDTO } from '../../../api/entities/User';
import {
  InviteTeamMemberForm,
  UpdateTeamMemberForm,
  UserResponse,
} from '../../services/userAccount';
import { validateEmail } from '../../utils/textHelpers';
import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { Dialog } from '../Core/Dialog/Dialog';
import { SelectInput } from '../Input/SelectInput';
import { TextInput } from '../Input/TextInput';
import { validateUniqueTeamMemberEmail } from './TeamMemberHelper';

type AddTeamMemberDialogProps = {
  teamMembers: UserDTO[];
  onAddTeamMember: (form: InviteTeamMemberForm) => Promise<void>;
  onOpenChange: () => void;
  person?: never;
};
type UpdateTeamMemberDialogProps = {
  teamMembers: UserDTO[];
  onUpdateTeamMember: (form: UpdateTeamMemberForm) => Promise<void>;
  onOpenChange: () => void;
  person: UserResponse;
};
type TeamMemberDialogProps = AddTeamMemberDialogProps | UpdateTeamMemberDialogProps;

const isUpdateTeamMemberDialogProps = (
  props: TeamMemberDialogProps
): props is UpdateTeamMemberDialogProps => 'person' in props;

function TeamMemberDialog(props: TeamMemberDialogProps) {
  const formMethods = useForm<InviteTeamMemberForm>({
    defaultValues: props.person as InviteTeamMemberForm,
  });
  const { handleSubmit } = formMethods;

  const onSubmit = async (formData: InviteTeamMemberForm) => {
    if (isUpdateTeamMemberDialogProps(props)) {
      const { firstName, lastName, jobFunction } = formData;
      await props.onUpdateTeamMember({ firstName, lastName, jobFunction });
    } else {
      await props.onAddTeamMember(formData);
    }
    props.onOpenChange();
  };

  return (
    <Dialog
      title={`${props.person ? 'Edit' : 'Add'} Team Member`}
      closeButtonText='Cancel'
      onOpenChange={props.onOpenChange}
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
              validate: (value: string) => {
                if (!validateUniqueTeamMemberEmail(value, props.teamMembers))
                  return 'Team member email already exists.';
                return validateEmail(value) ? true : 'Invalid email format.';
              },
            }}
          />
          <SelectInput
            inputName='jobFunction'
            label='Job Function'
            rules={{ required: 'Please specify your job function.' }}
            options={(Object.keys(JobFunction) as Array<keyof typeof JobFunction>).map((key) => ({
              optionLabel: JobFunction[key],
              value: JobFunction[key],
            }))}
          />
          <FormSubmitButton>Save Team Member</FormSubmitButton>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default TeamMemberDialog;
