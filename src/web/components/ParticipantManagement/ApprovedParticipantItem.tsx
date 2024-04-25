import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { UserDTO } from '../../../api/entities/User';
import { UpdateParticipantForm } from '../../services/participant';
import ApiRolesCell from '../ApiKeyManagement/ApiRolesCell';
import EditParticipantDialog from './EditParticipantDialog';

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
  const [showUpdateParticipantDialog, setShowUpdateParticipantDialog] = useState<boolean>(false);

  const onOpenChangeUpdateParticipantDialog = () => {
    setShowUpdateParticipantDialog(!showUpdateParticipantDialog);
  };

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
    let dateString: string = '';
    if (dateApproved) {
      dateString = new Date(dateApproved).toLocaleDateString();
    }
    return dateString;
  }

  function getApprover(approver: UserDTO | undefined): string {
    if (approver) return `${approver.firstName} ${approver.lastName}`;

    return `Information not available`;
  }

  return (
    <tr className='participant-management-item'>
      <td>{participant.name}</td>
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
        <ApiRolesCell apiRoles={participant.apiRoles ?? []} showRoleTooltip />
      </td>
      <td>{participant.crmAgreementNumber}</td>
      <td className='action'>
        <div className='action-cell'>
          <button
            type='button'
            className='transparent-button'
            onClick={onOpenChangeUpdateParticipantDialog}
          >
            <FontAwesomeIcon icon='pencil' />
          </button>
          {showUpdateParticipantDialog && (
            <EditParticipantDialog
              apiRoles={apiRoles}
              onEditParticipant={onUpdateParticipant}
              participant={participant}
              participantTypes={participantTypes}
              onOpenChange={onOpenChangeUpdateParticipantDialog}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
