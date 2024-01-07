import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantUpdateForm } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';

type UpdateParticipantDialogProps = {
  triggerButton: JSX.Element;
  participant: ParticipantDTO;
  onUpdateParticipant: (form: ParticipantUpdateForm, participant: ParticipantDTO) => Promise<void>;
  apiRoles: ApiRoleDTO[];
};

function UpdateParticipantDialog(props: UpdateParticipantDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<ParticipantUpdateForm> = async (formData) => {
    await props.onUpdateParticipant(formData, props.participant);
    setOpen(false);
  };

  const currentFormValue: ParticipantUpdateForm = {
    apiRoles: props.participant.apiRoles
      ? props.participant.apiRoles.map((apiRole) => apiRole.id)
      : [],
  };

  return (
    <Dialog
      triggerButton={props.triggerButton}
      title={`Edit ${props.participant.name}`}
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<ParticipantUpdateForm>
        onSubmit={onSubmit}
        submitButtonText='Update Participant'
        defaultValues={currentFormValue}
      >
        <CheckboxInput
          inputName='apiRoles'
          label='API Roles'
          rules={{ required: 'Please specify the API Roles' }}
          options={props.apiRoles.map((p) => ({
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
