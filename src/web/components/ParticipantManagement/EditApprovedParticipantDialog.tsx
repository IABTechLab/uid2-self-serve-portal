import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantEditForm } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';

type EditApprovedParticipantDialogProps = {
  onEditParticipant: (form: ParticipantEditForm) => void;
  triggerButton: JSX.Element;
  participant: ParticipantDTO;
  apiRoles: ApiRoleDTO[];
};

function EditApprovedParticipantDialog(props: EditApprovedParticipantDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<ParticipantEditForm> = async (formData) => {
    await props.onEditParticipant(formData);
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
      title='Edit Participant'
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <h1>Edit {props.participant.name}</h1>

      <Form<ParticipantEditForm>
        onSubmit={onSubmit}
        submitButtonText='Create Key Pair'
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
