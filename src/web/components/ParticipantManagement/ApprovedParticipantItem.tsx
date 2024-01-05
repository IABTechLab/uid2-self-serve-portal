import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantEditForm } from '../../services/participant';
import ApiRolesCell from '../ApiKeyManagement/ApiRolesCell';
import EditApprovedParticipantDialog from './EditApprovedParticipantDialog';

import './ParticipantManagementItem.scss';

type ApprovedParticipantProps = {
  participant: ParticipantDTO;
  apiRoles: ApiRoleDTO[];
  onEditParticipant: (form: ParticipantEditForm, participant: ParticipantDTO) => Promise<void>;
};

export function ApprovedParticipantItem({
  participant,
  apiRoles,
  onEditParticipant,
}: ApprovedParticipantProps) {
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
      <td>
        <EditApprovedParticipantDialog
          apiRoles={apiRoles}
          onEditParticipant={onEditParticipant}
          participant={participant}
          triggerButton={
            <button type='button' className='transparent-button'>
              Edit
            </button>
          }
        />
      </td>
    </tr>
  );
}
