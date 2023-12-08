import { ParticipantDTO } from '../../../api/entities/Participant';

import './ParticipantRequestItem.scss';

type ApprovedParticipantProps = {
  participant: ParticipantDTO;
};

export function ApprovedParticipantItem({ participant }: ApprovedParticipantProps) {
  function getParticipantTypes(
    currentParticipantTypes?: ApprovedParticipantProps['participant']['types']
  ) {
    if (!currentParticipantTypes) return null;
    return currentParticipantTypes.map((pt) => (
      <div className='participant-request-type-label' key={pt.typeName}>
        {pt.typeName}
      </div>
    ));
  }

  return (
    <tr className='participant-request-item'>
      <td>
        <div className='participant-name'>{participant.name}</div>
      </td>
      <td>
        <div className='participant-types'>{getParticipantTypes(participant.types)}</div>
      </td>
    </tr>
  );
}
