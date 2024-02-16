import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { UpdateParticipantForm } from '../../services/participant';
import { sortApiRoles } from '../../utils/apiRoles';
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
  triggerButton,
  participant,
  onUpdateParticipant,
  apiRoles,
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
      closeButtonText='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<UpdateParticipantForm>
        onSubmit={onSubmit}
        submitButtonText='Save Participant'
        defaultValues={originalFormValues}
      >
        <CheckboxInput
          inputName='apiRoles'
          label='API Permissions'
          options={sortApiRoles(apiRoles).map((p) => ({
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
