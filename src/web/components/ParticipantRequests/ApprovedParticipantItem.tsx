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

  function getApiRoles(currApiRoles?: ApprovedParticipantProps['participant']['apiRoles']) {
    if (!currApiRoles) return null;
    return currApiRoles.map((role) => (
      <div className='participant-request-api-role-label' key={role.roleName}>
        {role.roleName}
      </div>
    ));
  }

  console.log(participant);

  return (
    <tr className='participant-request-item'>
      <td>
        <div className='participant-name'>{participant.name}</div>
      </td>
      <td>
        <div className='participant-types'>{getParticipantTypes(participant.types)}</div>
      </td>
      <td>
        <div className='api-roles'>{getApiRoles(participant.apiRoles)}</div>
      </td>
    </tr>
  );
}
