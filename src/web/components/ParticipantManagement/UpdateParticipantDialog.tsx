import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { UpdateParticipantForm } from '../../services/participant';
import { sortApiRoles } from '../../utils/apiRoles';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { MultiCheckboxInput } from '../Input/MultiCheckboxInput';
import { TextInput } from '../Input/TextInput';
import { validatecrmAgreementNumber } from './AddParticipantDialogHelper';

type UpdateParticipantDialogProps = Readonly<{
  triggerButton: JSX.Element;
  participant: ParticipantDTO;
  onUpdateParticipant: (form: UpdateParticipantForm, participant: ParticipantDTO) => Promise<void>;
  apiRoles: ApiRoleDTO[];
  participantTypes: ParticipantTypeDTO[];
}>;

function UpdateParticipantDialog({
  triggerButton,
  participant,
  onUpdateParticipant,
  apiRoles,
  participantTypes,
}: UpdateParticipantDialogProps) {
  const [open, setOpen] = useState(false);
  const [typesAndRolesError, setTypesAndRolesError] = useState(false);

  const onSubmit: SubmitHandler<UpdateParticipantForm> = async (formData) => {
    if (formData.participantTypes.length === 0 || formData.apiRoles.length === 0) {
      setTypesAndRolesError(true);
    } else {
      await onUpdateParticipant(formData, participant);
      setOpen(false);
    }
  };

  const onOpenChange = () => {
    setOpen(!open);
    setTypesAndRolesError(false);
  };

  const originalFormValues: UpdateParticipantForm = {
    apiRoles: participant.apiRoles ? participant.apiRoles.map((apiRole) => apiRole.id) : [],
    participantTypes: participant.types ? participant.types.map((pType) => pType.id) : [],
    participantName: participant.name,
    crmAgreementNumber: participant.crmAgreementNumber ?? '',
  };

  return (
    <Dialog
      triggerButton={triggerButton}
      title={`Edit Participant: ${participant.name}`}
      closeButtonText='Cancel'
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form<UpdateParticipantForm>
        onSubmit={onSubmit}
        submitButtonText='Save Participant'
        defaultValues={originalFormValues}
      >
        {typesAndRolesError && (
          <p className='form-error'>
            Participant must have at least one participant type and at least one API permission.
          </p>
        )}
        <TextInput inputName='participantName' label='Participant Name' className='text-input' />
        <MultiCheckboxInput
          inputName='participantTypes'
          label='Participant Type'
          options={participantTypes.map((p) => ({
            optionLabel: p.typeName,
            value: p.id,
          }))}
        />
        <MultiCheckboxInput
          inputName='apiRoles'
          label='API Permissions'
          options={sortApiRoles(apiRoles).map((p) => ({
            optionLabel: p.externalName,
            optionToolTip: p.roleName,
            value: p.id,
          }))}
        />
        <TextInput
          inputName='crmAgreementNumber'
          label='Salesforce Agreement Number'
          className='text-input'
          maxLength={8}
          rules={{
            validate: validatecrmAgreementNumber,
          }}
        />
      </Form>
    </Dialog>
  );
}

export default UpdateParticipantDialog;
