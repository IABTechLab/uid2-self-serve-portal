import { ParticipantRequestDTO } from '../../../api/routers/participantsRouter';

import './ParticipantRequestItem.scss';

type ApprovedParticipantProps = {
  participant: ParticipantRequestDTO;
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
      <td>
        <div className='participant-api-roles' />
      </td>
      <td>
        <div className='participant-approver-name' />
      </td>
      <td>
        <div className='participant-approved-date' />
      </td>
      <td className='action'>
        <div className='action-cell' />
      </td>
    </tr>
  );
}
