import { useState } from 'react';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { UserDTO } from '../../../api/entities/User';
import { UpdateParticipantForm } from '../../services/participant';
import ApiRolesCell from '../ApiKeyManagement/ApiRolesCell';
import ActionButton from '../Core/Buttons/ActionButton';
import { LabelRow } from '../Core/Labels/LabelRow';
import EditParticipantDialog from './EditParticipantDialog';

import './ParticipantManagementItem.scss';

type ParticipantManagmentItemProps = Readonly<{
  participant: ParticipantDTO;
  apiRoles: ApiRoleDTO[];
  participantTypes: ParticipantTypeDTO[];
  onUpdateParticipant: (form: UpdateParticipantForm, participant: ParticipantDTO) => Promise<void>;
}>;

export function ParticipantManagmentItem({
  participant,
  apiRoles,
  participantTypes,
  onUpdateParticipant,
}: ParticipantManagmentItemProps) {
  const [showEditParticipantDialog, setShowEditParticipantDialog] = useState<boolean>(false);

  const onOpenChangeEditParticipantDialog = () => {
    setShowEditParticipantDialog(!showEditParticipantDialog);
  };

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
        <LabelRow labelNames={participant.types?.map((t) => t.typeName) ?? []} />
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
          <ActionButton onClick={onOpenChangeEditParticipantDialog} icon='pencil' />
          {showEditParticipantDialog && (
            <EditParticipantDialog
              apiRoles={apiRoles}
              onEditParticipant={onUpdateParticipant}
              participant={participant}
              participantTypes={participantTypes}
              onOpenChange={onOpenChangeEditParticipantDialog}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
