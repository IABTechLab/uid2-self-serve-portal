import { UserResponse } from '../../services/userAccount';
import { Dialog } from '../Core/Dialog/Dialog';

type TeamMemberDeleteConfirmationDialogProps = Readonly<{
  person: UserResponse;
  onRemoveTeamMember: () => Promise<void>;
  onOpenChange: () => void;
}>;

function TeamMemberDeleteConfirmationDialog({
  person,
  onRemoveTeamMember,
  onOpenChange,
}: TeamMemberDeleteConfirmationDialogProps) {
  const handleRemove = async () => {
    await onRemoveTeamMember();
    onOpenChange();
  };

  return (
    <Dialog
      title='Are you sure you want to delete this team member?'
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
          Delete Team Member
        </button>
      </div>
    </Dialog>
  );
}

export default TeamMemberDeleteConfirmationDialog;
