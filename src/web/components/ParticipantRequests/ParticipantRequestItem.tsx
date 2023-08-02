import { useState } from 'react';

import { ParticipantRequestDTO } from '../../../api/participantsRouter';
import { InlineError } from '../Core/InlineError';

import './ParticipantRequestItem.scss';

type ParticipantRequestProps = {
  participantRequest: ParticipantRequestDTO;
};

export function ParticipantRequestItem({
  participantRequest: participant,
}: ParticipantRequestProps) {
  const [hasError, setHasError] = useState<boolean>(false);
  function getParticipantTypes(
    participantTypes?: ParticipantRequestProps['participantRequest']['types']
  ) {
    if (!participantTypes) return null;
    return participantTypes.map((pt) => (
      <div className='participant-request-type-label' key={pt.typeName}>
        {pt.typeName}
      </div>
    ));
  }

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
        <button type='button' className='transparent-button' onClick={() => {}}>
          Approve
        </button>
      </td>
    </tr>
  );
}
