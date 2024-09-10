import { UserResponse } from '../../services/userAccount';
import { Dialog } from '../Core/Dialog/Dialog';

type TeamMemberRemoveConfirmationDialogProps = Readonly<{
  person: UserResponse;
  onRemoveTeamMember: () => Promise<void>;
  onOpenChange: () => void;
}>;

function TeamMemberRemoveConfirmationDialog({
  person,
  onRemoveTeamMember,
  onOpenChange,
}: TeamMemberRemoveConfirmationDialogProps) {
  const handleRemove = async () => {
    await onRemoveTeamMember();
    onOpenChange();
  };

  return (
    <Dialog
      title='Are you sure you want to remove this team member?'
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      <ul className='dot-list'>
        <li>
          {person.firstName} {person.lastName}
        </li>
      </ul>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleRemove}>
          Remove Team Member
        </button>
      </div>
    </Dialog>
  );
}

export default TeamMemberRemoveConfirmationDialog;
