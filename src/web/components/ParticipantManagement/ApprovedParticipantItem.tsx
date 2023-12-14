import { ParticipantDTO } from '../../../api/entities/Participant';
import { Tooltip } from '../Core/Tooltip';

import './ParticipantManagementItem.scss';

type ApprovedParticipantProps = {
  participant: ParticipantDTO;
};

export function ApprovedParticipantItem({ participant }: ApprovedParticipantProps) {
  function getParticipantTypes(
    currentParticipantTypes?: ApprovedParticipantProps['participant']['types']
  ) {
    if (!currentParticipantTypes) return null;
    return currentParticipantTypes.map((pt) => (
      <div className='participant-item-type-label' key={pt.typeName}>
        {pt.typeName}
      </div>
    ));
  }

  function getApiRoles(currApiRoles?: ApprovedParticipantProps['participant']['apiRoles']) {
    if (!currApiRoles) return null;
    return currApiRoles.map((role) => (
      <div className='participant-item-api-role-label' key={role.externalName}>
        <Tooltip trigger={role.externalName}>{role.roleName}</Tooltip>
      </div>
    ));
  }

  return (
    <tr className='participant-management-item'>
      <td>
        <div className='participant-name'>{participant.name}</div>
      </td>
      <td>
        <div className='participant-item-types'>{getParticipantTypes(participant.types)}</div>
      </td>
      <td>
        <div className='participant-item-api-roles'>{getApiRoles(participant.apiRoles)}</div>
      </td>
    </tr>
  );
}
