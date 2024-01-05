import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantEditForm } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';

type EditApprovedParticipantDialogProps = {
  triggerButton: JSX.Element;
  participant: ParticipantDTO;
  onEditParticipant: (form: ParticipantEditForm, participant: ParticipantDTO) => Promise<void>;
  apiRoles: ApiRoleDTO[];
};

function EditApprovedParticipantDialog(props: EditApprovedParticipantDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<ParticipantEditForm> = async (formData) => {
    await props.onEditParticipant(formData, props.participant);
    setOpen(false);
  };

  const currentFormValue: ParticipantEditForm = {
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
      <Form<ParticipantEditForm>
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

export default EditApprovedParticipantDialog;
