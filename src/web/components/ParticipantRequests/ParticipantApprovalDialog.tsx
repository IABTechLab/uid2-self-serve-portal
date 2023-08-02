import { useMemo, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../../api/participantsRouter';
import { ParticipantApprovalForm } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';
import { TextInput } from '../Input/TextInput';

type ParticipantApprovalDialogProps = {
  onApprove: (formData: ParticipantApprovalForm) => Promise<void>;
  participant: ParticipantRequestDTO;
  participantTypes: ParticipantTypeDTO[];
};
function ParticipantApprovalDialog({
  onApprove,
  participant,
  participantTypes,
}: ParticipantApprovalDialogProps) {
  const [open, setOpen] = useState(false);
  const onSubmit: SubmitHandler<ParticipantApprovalForm> = async (formData) => {
    await onApprove(formData);
    setOpen(false);
  };

  const formatParticipantToFormValues = useMemo(
    () => ({ name: participant.name, types: participant.types?.map((t) => t.id) }),
    [participant]
  );

  return (
    <Dialog
      triggerButton={
        <button type='button' className='transparent-button' onClick={() => {}}>
          Approve
        </button>
      }
      title='Approve Participant Request'
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<ParticipantApprovalForm>
        onSubmit={onSubmit}
        submitButtonText='Approve Participant'
        defaultValues={formatParticipantToFormValues}
      >
        <TextInput
          inputName='name'
          label='Participant Name'
          rules={{ required: 'Please specify participant name.' }}
        />
        <TextInput
          inputName='siteId'
          label='Site ID'
          type='number'
          rules={{ required: 'Please specify site id.' }}
        />
        <CheckboxInput
          inputName='types'
          label='Participant Type'
          options={participantTypes.map((p) => ({
            optionLabel: p.typeName,
            value: p.id,
          }))}
          rules={{ required: 'Please specify Participant type.' }}
        />
      </Form>
    </Dialog>
  );
}

export default ParticipantApprovalDialog;
