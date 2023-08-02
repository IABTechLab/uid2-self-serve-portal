import { useState } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../../api/participantsRouter';
import { ApproveParticipant, ParticipantApprovalForm } from '../../services/participant';
import { InlineError } from '../Core/InlineError';
import ParticipantApprovalDialog from './ParticipantApprovalDialog';

import './ParticipantRequestItem.scss';

type ParticipantRequestProps = {
  participantRequest: ParticipantRequestDTO;
  participantTypes: ParticipantTypeDTO[];
};

export function ParticipantRequestItem({
  participantRequest: participant,
  participantTypes,
}: ParticipantRequestProps) {
  const [hasError, setHasError] = useState<boolean>(false);
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

  const handleApprove = async (formData: ParticipantApprovalForm) => {
    try {
      await ApproveParticipant(participant.id, formData);
    } catch (err) {
      setHasError(true);
    }
  };
  // TODO: update this when we have login uploading
  const logo = '/default-logo.svg';
  return (
    <tr className='participant-request-item'>
      <td className='participant-request-name-cell'>
        <img src={logo} alt={participant.name} className='participant-request-logo' />
        <label htmlFor={`checkbox-${participant.id}`} className='checkbox-label'>
          {participant.name}
        </label>
      </td>
      <td>
        <div className='participant-request-types'>{getParticipantTypes(participant.types)}</div>
      </td>
      <td>
        <div className='participant-request-status'>{participant.status}</div>
      </td>
      <td>
        {hasError && <InlineError />}
        <ParticipantApprovalDialog
          onApprove={handleApprove}
          participant={participant}
          participantTypes={participantTypes}
        />
      </td>
    </tr>
  );
}
