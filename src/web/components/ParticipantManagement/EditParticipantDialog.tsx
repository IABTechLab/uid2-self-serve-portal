import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { GetParticipantVisibility, UpdateParticipantForm } from '../../services/participant';
import { sortApiRoles } from '../../utils/apiRoles';
import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { Dialog } from '../Core/Dialog/Dialog';
import { MultiCheckboxInput } from '../Input/MultiCheckboxInput';
import { FormStyledCheckbox } from '../Input/StyledCheckbox';
import { TextInput } from '../Input/TextInput';
import { validateEditCrmAgreementNumber } from './AddParticipantDialogHelper';
import { getPrimaryContactInformation } from './EditParticipantDialogHelpers';

import './EditParticipantDialog.scss';

type EditParticipantDialogProps = Readonly<{
  participant: ParticipantDTO;
  onEditParticipant: (form: UpdateParticipantForm, participant: ParticipantDTO) => Promise<void>;
  apiRoles: ApiRoleDTO[];
  participantTypes: ParticipantTypeDTO[];
  onOpenChange: () => void;
}>;

function EditParticipantDialog({
  participant,
  onEditParticipant,
  apiRoles,
  participantTypes,
  onOpenChange,
}: EditParticipantDialogProps) {
  const onSubmit = async (formData: UpdateParticipantForm) => {
    await onEditParticipant(formData, participant);
    onOpenChange();
  };

  const contact = getPrimaryContactInformation(participant);
  const originalFormValues: UpdateParticipantForm = {
    apiRoles: participant.apiRoles ? participant.apiRoles.map((apiRole) => apiRole.id) : [],
    participantTypes: participant.types ? participant.types.map((pType) => pType.id) : [],
    participantName: participant.name,
    crmAgreementNumber: participant.crmAgreementNumber,
    siteId: participant.siteId!,
    contactFirstName: contact.firstName,
    contactLastName: contact.lastName,
    contactEmail: contact.email,
    visible: true,
  };

  const formMethods = useForm<UpdateParticipantForm>({
    defaultValues: originalFormValues,
  });
  const { handleSubmit } = formMethods;

  useEffect(() => {
    (async () => {
      const isVisibile = await GetParticipantVisibility(participant.id);
      formMethods.reset({ ...originalFormValues, visible: isVisibile });
    })();
  }, [participant.id]);

  return (
    <Dialog
      title={`Edit Participant: ${participant.name}`}
      closeButtonText='Cancel'
      className='edit-participant-dialog'
      onOpenChange={onOpenChange}
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            inputName='participantName'
            label='Participant Name'
            className='text-input'
            rules={{ required: 'Please specify a participant name.' }}
          />
          <MultiCheckboxInput
            inputName='participantTypes'
            label='Participant Type'
            options={participantTypes.map((p) => ({
              optionLabel: p.typeName,
              value: p.id,
            }))}
            rules={{ required: 'Please specify Participant Types.' }}
          />
          <TextInput inputName='siteId' label='Site ID' disabled className='site-id-input' />

          <div className='visible-checkbox'>
            <FormStyledCheckbox name='visible' control={formMethods.control} className='checkbox' />
            <span className='checkbox-text'>Visible</span>
          </div>
          <MultiCheckboxInput
            inputName='apiRoles'
            label='API Permissions'
            options={sortApiRoles(apiRoles).map((p) => ({
              optionLabel: p.externalName,
              optionToolTip: p.roleName,
              value: p.id,
            }))}
            rules={{ required: 'Please specify API Permissions.' }}
          />
          <TextInput
            inputName='crmAgreementNumber'
            label='Salesforce Agreement Number'
            className='text-input'
            maxLength={8}
            rules={{
              validate: (value: string) =>
                validateEditCrmAgreementNumber(value, originalFormValues.crmAgreementNumber),
            }}
          />
          <div className='contact-name'>
            <TextInput inputName='contactFirstName' label='Primary Contact First Name' disabled />
            <TextInput inputName='contactLastName' label='Primary Contact Last Name' disabled />
          </div>
          <TextInput inputName='contactEmail' label='Primary Contact Email' disabled />
          <FormSubmitButton>Save Participant</FormSubmitButton>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default EditParticipantDialog;
