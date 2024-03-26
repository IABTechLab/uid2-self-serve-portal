import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { User } from '../../../api/entities/User';
import { UpdateParticipantForm } from '../../services/participant';
import ApiRolesCell from '../ApiKeyManagement/ApiRolesCell';
import UpdateParticipantDialog from './UpdateParticipantDialog';

import './ParticipantManagementItem.scss';

type ApprovedParticipantProps = {
  participant: ParticipantDTO;
  apiRoles: ApiRoleDTO[];
  onUpdateParticipant: (form: UpdateParticipantForm, participant: ParticipantDTO) => Promise<void>;
};

export function ApprovedParticipantItem({
  participant,
  apiRoles,
  onUpdateParticipant,
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

  function getApproverDateString(dateApproved: Date | undefined) {
    let dateString: String = '';
    if (dateApproved) {
      const dateApprovedTest = new Date(dateApproved);
      dateString = `${dateApprovedTest.getMonth()}/${dateApprovedTest.getDate()}/${dateApprovedTest.getFullYear()}`;
    }
    return dateString;
  }

  function getApprover(approver: User | undefined): String {
    if (approver) return `${approver.firstName} ${approver.lastName}`;

    return `Information not available`;
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
        <div className='approver-name'>{getApprover(participant.approver)}</div>
      </td>
      <td>
        <div className='approver-date'>{getApproverDateString(participant.dateApproved)}</div>
      </td>
      <td>
        <ApiRolesCell
          apiRoles={participant.apiRoles == null ? [] : participant.apiRoles}
          showRoleTooltip
        />
      </td>
      <td className='action'>
        <div className='action-cell'>
          <UpdateParticipantDialog
            apiRoles={apiRoles}
            onUpdateParticipant={onUpdateParticipant}
            participant={participant}
            triggerButton={
              <button type='button' className='transparent-button'>
                <FontAwesomeIcon icon='pencil' />
              </button>
            }
          />
        </div>
      </td>
    </tr>
  );
}
