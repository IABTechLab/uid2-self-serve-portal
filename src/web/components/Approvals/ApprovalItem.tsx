import { z } from 'zod';

import { ParticipantTypeSchema } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/participantsRouter';

import './ApprovalItem.scss';

type ParticipantItemProps = {
  participant: AvailableParticipantDTO;
};

export function ApprovalItem({ participant }: ParticipantItemProps) {
  function getParticipantTypes(participantTypes?: z.infer<typeof ParticipantTypeSchema>[]) {
    if (!participantTypes) return null;
    return participantTypes.map((pt) => (
      <div className='approval-type-label' key={pt.typeName}>
        {pt.typeName}
      </div>
    ));
  }

  // TODO: update this when we have login uploading
  const logo = '/default-logo.svg';
  return (
    <tr className='approval-item'>
      <td className='approval-name-cell'>
        <img src={logo} alt={participant.name} className='approval-logo' />
        <label htmlFor={`checkbox-${participant.id}`} className='checkbox-label'>
          {participant.name}
        </label>
      </td>
      <td>
        <div className='approval-types'>{getParticipantTypes(participant.types)}</div>
      </td>
      <td>
        <div className='approval-status'>{participant.status}</div>
      </td>
    </tr>
  );
}
