import { useState } from 'react';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../../api/routers/participants/participantsRouter';
import { ParticipantApprovalFormDetails } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { InlineMessage } from '../Core/InlineMessage';
import ParticipantApprovalForm from './ParticipantApprovalForm';

import './ParticipantManagementItem.scss';

type ParticipantRequestProps = {
  participantRequest: ParticipantRequestDTO;
  participantTypes: ParticipantTypeDTO[];
  apiRoles: ApiRoleDTO[];
  onApprove: (participantId: number, formData: ParticipantApprovalFormDetails) => Promise<void>;
};

export function ParticipantRequestItem({
  participantRequest: participant,
  participantTypes,
  apiRoles,
  onApprove,
}: ParticipantRequestProps) {
  const [hasError, setHasError] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  function getParticipantTypes(
    currentParticipantTypes?: ParticipantRequestProps['participantRequest']['types']
  ) {
    if (!currentParticipantTypes) return null;
    return currentParticipantTypes.map((pt) => (
      <div className='participant-item-type-label' key={pt.typeName}>
        {pt.typeName}
      </div>
    ));
  }

  const handleApprove = async (formData: ParticipantApprovalFormDetails) => {
    try {
      await onApprove(participant.id, formData);
    } catch (err) {
      setHasError(true);
    }
  };

  return (
    <tr className='participant-management-item'>
      <td>
        <div className='participant-name'>{participant.name}</div>
      </td>
      <td>
        <div className='participant-item-types'>{getParticipantTypes(participant.types)}</div>
      </td>
      <td>
        <div className='participant-item-name'>{participant.requestingUser.fullName}</div>
      </td>
      <td>
        <div className='participant-item-email'>{participant.requestingUser.email}</div>
      </td>
      <td>
        <div className='participant-item-job-function'>{participant.requestingUser.role}</div>
      </td>
      <td className='action'>
        <div className='action-cell'>
          {hasError && <InlineMessage message='An error has occurred' type='Error' />}
          <button
            type='button'
            className='transparent-button approve-button'
            onClick={() => setOpen(true)}
          >
            Approve
          </button>
          <Dialog
            title='Approve Participant Request'
            closeButtonText='Cancel'
            open={open}
            onOpenChange={setOpen}
            className='participants-request-dialog'
          >
            <ParticipantApprovalForm
              onApprove={handleApprove}
              participant={participant}
              participantTypes={participantTypes}
              apiRoles={apiRoles}
            />
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
