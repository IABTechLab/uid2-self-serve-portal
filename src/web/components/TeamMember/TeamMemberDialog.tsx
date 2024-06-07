import { FormProvider, useForm } from 'react-hook-form';

import { UserDTO, UserRole } from '../../../api/entities/User';
import {
  InviteTeamMemberForm,
  UpdateTeamMemberForm,
  UserResponse,
} from '../../services/userAccount';
import {
  validateEmailJoi,
  validateEmailRegex,
  validateEmailValidator,
} from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import FormSubmitButton from '../Core/FormSubmitButton';
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
      const { firstName, lastName, role } = formData;
      await props.onUpdateTeamMember({ firstName, lastName, role });
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
              // pattern: {
              //   value: validateEmailRegex,
              //   message: 'Entered value does not match email format',
              // },
              // commented out for now to test single validate
              // validate: (value: string) => {
              //   return (
              //    validateUniqueTeamMemberEmail(value, props.teamMembers)
              //   );
              // },
              validate: (value: string) => {
                return validateEmailJoi(value) ? true : 'Invalid email format.';
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
          <FormSubmitButton>Save Team Member</FormSubmitButton>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default TeamMemberDialog;
