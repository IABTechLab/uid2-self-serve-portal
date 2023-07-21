import { z } from 'zod';

import { ParticipantTypeSchema } from '../../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../../api/participantsRouter';

import './ParticipantRequestItem.scss';

type ParticipantRequestProps = {
  participantRequest: ParticipantRequestDTO;
};

export function ParticipantRequestItem({
  participantRequest: participant,
}: ParticipantRequestProps) {
  function getParticipantTypes(participantTypes?: z.infer<typeof ParticipantTypeSchema>[]) {
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
    </tr>
  );
}
