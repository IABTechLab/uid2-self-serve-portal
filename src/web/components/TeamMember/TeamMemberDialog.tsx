import { FormProvider, useForm } from 'react-hook-form';

import { ParticipantDTO } from '../../../api/entities/Participant';
import { UserJobFunction } from '../../../api/entities/User';
import { UserRoleId } from '../../../api/entities/UserRole';
import { UserWithParticipantRoles } from '../../../api/services/usersService';
import { InviteTeamMemberForm, UpdateTeamMemberForm } from '../../services/userAccount';
import { validateEmail } from '../../utils/textHelpers';
import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { Dialog } from '../Core/Dialog/Dialog';
import { Tooltip } from '../Core/Tooltip/Tooltip';
import { RadioInput } from '../Input/RadioInput';
import { SelectInput } from '../Input/SelectInput';
import { FormStyledCheckbox, StyledCheckbox } from '../Input/StyledCheckbox';
import { TextInput } from '../Input/TextInput';
import { validateUniqueTeamMemberEmail } from './TeamMemberHelper';

import './TeamMemberDialog.scss';

type AddTeamMemberDialogProps = {
  teamMembers: UserWithParticipantRoles[];
  onAddTeamMember: (form: InviteTeamMemberForm) => Promise<void>;
  onOpenChange: () => void;
  selectedParticipant?: ParticipantDTO;
  person?: never;
};
type UpdateTeamMemberDialogProps = {
  teamMembers: UserWithParticipantRoles[];
  onUpdateTeamMember: (form: UpdateTeamMemberForm, hasUserFieldsChanged: boolean) => Promise<void>;
  onOpenChange: () => void;
  selectedParticipant?: ParticipantDTO;
  person: UserWithParticipantRoles;
};
type TeamMemberDialogProps = AddTeamMemberDialogProps | UpdateTeamMemberDialogProps;

const isUpdateTeamMemberDialogProps = (
  props: TeamMemberDialogProps
): props is UpdateTeamMemberDialogProps => 'person' in props;

function TeamMemberDialog(props: TeamMemberDialogProps) {
  const isPrimaryContact =
    isUpdateTeamMemberDialogProps(props) &&
    props.selectedParticipant?.primaryContact?.id === props.person?.id;
  const formMethods = useForm<InviteTeamMemberForm>({
    defaultValues: {
      firstName: props.person?.firstName,
      lastName: props.person?.lastName,
      email: props.person?.email,
      jobFunction: props.person?.jobFunction,
      userRoleId: props.person?.currentParticipantUserRoles?.[0]?.id ?? undefined,
      setPrimaryContact: isPrimaryContact,
    },
  });
  const { handleSubmit } = formMethods;
  const editMode = !!props.person;

  const allowedRolesToAdd = ['Admin', 'Operations'];
  const selectedRoleId = formMethods.watch('userRoleId');
  const isOperations = selectedRoleId === UserRoleId.Operations;

  const onSubmit = async (formData: InviteTeamMemberForm) => {
    if (isUpdateTeamMemberDialogProps(props)) {
      const { firstName, lastName, jobFunction, userRoleId, setPrimaryContact } = formData;
      const hasUserFieldsChanged =
        firstName !== props.person.firstName ||
        lastName !== props.person.lastName ||
        jobFunction !== props.person.jobFunction ||
        userRoleId !== props.person.currentParticipantUserRoles?.[0]?.id;
      await props.onUpdateTeamMember({
        firstName,
        lastName,
        jobFunction,
        userRoleId,
        setPrimaryContact,
      }, hasUserFieldsChanged);
    } else {
      await props.onAddTeamMember(formData);
    }
    props.onOpenChange();
  };

  const checkbox = (
    <FormStyledCheckbox
      name='setPrimaryContact'
      control={formMethods.control}
      className='checkbox'
      disabled={isPrimaryContact || isOperations}
    />
  );

  const checkboxContent = isOperations ? (
    <Tooltip
      trigger={
        <>
          {checkbox}
          <span className='checkbox-text'>Set as primary contact</span>
        </>
      }
    >
      Only Admins can be assigned as primary contact
    </Tooltip>
  ) : (
    <>
      {checkbox}
      <span className='checkbox-text'>Set as primary contact</span>
    </>
  );

  return (
    <Dialog
      title={`${editMode ? 'Edit' : 'Add'} Team Member`}
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
            disabled={editMode}
            rules={{
              required: 'Please specify email.',
              validate: (value: string) => {
                if (!editMode && !validateUniqueTeamMemberEmail(value, props.teamMembers))
                  return 'Team member email already exists.';
                return validateEmail(value) ? true : 'Invalid email format.';
              },
            }}
          />
          <SelectInput
            inputName='jobFunction'
            label='Job Function'
            rules={{ required: 'Please specify your job function.' }}
            options={(Object.keys(UserJobFunction) as Array<keyof typeof UserJobFunction>).map(
              (key) => ({ optionLabel: UserJobFunction[key], value: UserJobFunction[key] })
            )}
          />
          <RadioInput
            inputName='userRoleId'
            label='Role'
            rules={{ required: 'Please specify a role.' }}
            options={(Object.keys(UserRoleId) as Array<keyof typeof UserRoleId>)
              .filter(
                (key) => allowedRolesToAdd.includes(key) && typeof UserRoleId[key] === 'number'
              )
              .map((key) => ({ optionLabel: key, value: UserRoleId[key] }))}
          />
          <div className='checkbox-container'>{checkboxContent}</div>

          <FormSubmitButton>Save Team Member</FormSubmitButton>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default TeamMemberDialog;
