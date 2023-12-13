import { useState } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../../api/routers/participantsRouter';
import { ParticipantApprovalFormDetails } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { InlineMessage } from '../Core/InlineMessage';
import ParticipantApprovalForm from './ParticipantApprovalForm';

import './ParticipantRequestItem.scss';

type ParticipantRequestProps = {
  participantRequest: ParticipantRequestDTO;
  participantTypes: ParticipantTypeDTO[];
  onApprove: (participantId: number, formData: ParticipantApprovalFormDetails) => Promise<void>;
};

export function ParticipantRequestItem({
  participantRequest: participant,
  participantTypes,
  onApprove,
}: ParticipantRequestProps) {
  const [hasError, setHasError] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  function getParticipantTypes(
    currentParticipantTypes?: ParticipantRequestProps['participantRequest']['types']
  ) {
    if (!currentParticipantTypes) return null;
    return currentParticipantTypes.map((pt) => (
      <div className='participant-request-type-label' key={pt.typeName}>
        {pt.typeName}
      </div>
    ));
  }

  const handleApprove = async (formData: ParticipantApprovalFormDetails) => {
    try {
      await onApprove(participant.id, formData);
    } catch (err) {
      setHasError(true);
    }
  };

  return (
    <tr className='participant-request-item'>
      <td>
        <div className='participant-name'>{participant.name}</div>
      </td>
      <td>
        <div className='participant-request-types'>{getParticipantTypes(participant.types)}</div>
      </td>
      <td>
        <div className='participant-request-name'>{participant.requestingUser.fullName}</div>
      </td>
      <td>
        <div className='participant-request-email'>{participant.requestingUser.email}</div>
      </td>
      <td>
        <div className='participant-request-job-function'>{participant.requestingUser.role}</div>
      </td>
      <td className='action'>
        <div className='action-cell'>
          {hasError && <InlineMessage message='An error has occurred' type='Error' />}
          <button type='button' className='transparent-button' onClick={() => setOpen(true)}>
            Approve
          </button>
          <Dialog
            title='Approve Participant Request'
            closeButton='Cancel'
            open={open}
            onOpenChange={setOpen}
            className='participants-request-dialog'
          >
            <ParticipantApprovalForm
              onApprove={handleApprove}
              participant={participant}
              participantTypes={participantTypes}
            />
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
