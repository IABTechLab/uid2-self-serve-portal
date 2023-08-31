import { useState } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../../api/routers/participantsRouter';
import { ParticipantApprovalFormDetails } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { InlineError } from '../Core/InlineError';
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
  // TODO: update this when we have login uploading
  const logo = '/default-logo.svg';
  return (
    <>
      <tr className='participant-request-item'>
        <td>
          <div className='participant-request-name-cell'>
            <img src={logo} alt={participant.name} className='participant-request-logo' />
            <label htmlFor={`checkbox-${participant.id}`} className='checkbox-label'>
              {participant.name}
            </label>
          </div>
        </td>
        <td>
          <div className='participant-request-types'>{getParticipantTypes(participant.types)}</div>
        </td>
        <td>
          <div className='participant-request-status'>{participant.status}</div>
        </td>
        <td className='action'>
          <div className='action-cell'>
            {hasError && <InlineError />}
            <button type='button' className='transparent-button' onClick={() => setOpen(true)}>
              Approve
            </button>
          </div>
        </td>
      </tr>
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
    </>
  );
}
