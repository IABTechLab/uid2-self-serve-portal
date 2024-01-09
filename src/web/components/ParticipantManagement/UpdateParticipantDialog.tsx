import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { UpdateParticipantForm } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';

type UpdateParticipantDialogProps = {
  triggerButton: JSX.Element;
  participant: ParticipantDTO;
  onUpdateParticipant: (form: UpdateParticipantForm, participant: ParticipantDTO) => Promise<void>;
  apiRoles: ApiRoleDTO[];
};

function UpdateParticipantDialog({
  apiRoles,
  onUpdateParticipant,
  participant,
  triggerButton,
}: UpdateParticipantDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<UpdateParticipantForm> = async (formData) => {
    await onUpdateParticipant(formData, participant);
    setOpen(false);
  };

  const originalFormValues: UpdateParticipantForm = {
    apiRoles: participant.apiRoles ? participant.apiRoles.map((apiRole) => apiRole.id) : [],
  };

  return (
    <Dialog
      triggerButton={triggerButton}
      title={`Edit ${participant.name}`}
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<UpdateParticipantForm>
        onSubmit={onSubmit}
        submitButtonText='Update Participant'
        defaultValues={originalFormValues}
      >
        <CheckboxInput
          inputName='apiRoles'
          label='API Roles'
          rules={{ required: 'Please specify the API Roles' }}
          options={apiRoles.map((p) => ({
            optionLabel: p.externalName,
            optionToolTip: p.roleName,
            value: p.id,
          }))}
        />
      </Form>
    </Dialog>
  );
}

export default UpdateParticipantDialog;
