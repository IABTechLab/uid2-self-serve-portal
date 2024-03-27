import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { UpdateParticipantForm } from '../../services/participant';
import ApiRolesCell from '../ApiKeyManagement/ApiRolesCell';
import UpdateParticipantDialog from './UpdateParticipantDialog';

import './ParticipantManagementItem.scss';

type ApprovedParticipantProps = Readonly<{
  participant: ParticipantDTO;
  apiRoles: ApiRoleDTO[];
  participantTypes: ParticipantTypeDTO[];
  onUpdateParticipant: (form: UpdateParticipantForm, participant: ParticipantDTO) => Promise<void>;
}>;

export function ApprovedParticipantItem({
  participant,
  apiRoles,
  participantTypes,
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

  return (
    <tr className='participant-management-item'>
      <td>{participant.name}</td>
      <td>
        <div className='participant-item-types'>{getParticipantTypes(participant.types)}</div>
      </td>
      <td>
        <ApiRolesCell apiRoles={participant.apiRoles ?? []} showRoleTooltip />
      </td>
      <td>{participant.crmAgreementNumber}</td>
      <td className='action'>
        <div className='action-cell'>
          <UpdateParticipantDialog
            apiRoles={apiRoles}
            onUpdateParticipant={onUpdateParticipant}
            participant={participant}
            participantTypes={participantTypes}
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
