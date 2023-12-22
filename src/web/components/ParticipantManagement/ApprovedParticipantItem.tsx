import { ParticipantDTO } from '../../../api/entities/Participant';
import ApiRolesCell from '../ApiKeyManagement/ApiRolesCell';

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

  return (
    <tr className='participant-management-item'>
      <td>
        <div className='participant-name'>{participant.name}</div>
      </td>
      <td>
        <div className='participant-item-types'>{getParticipantTypes(participant.types)}</div>
      </td>
      <td>
        <ApiRolesCell
          apiRoles={participant.apiRoles == null ? [] : participant.apiRoles}
          showRoleTooltip
        />
      </td>
    </tr>
  );
}
