import { ParticipantDTO } from '../../../api/entities/Participant';
import { UserDTO } from '../../../api/entities/User';
import { UserRoleId } from '../../../api/entities/UserRole';
import { Dialog } from '../Core/Dialog/Dialog';
import UserParticipantsTable from './UserPartcipantsTable';

type UserParticipantRolesDialogProps = Readonly<{
  user: UserDTO;
  userParticipants: ParticipantDTO[];
  onOpenChange: () => void;
}>;

function UserParticipantRolesDialog({
  user,
  userParticipants,
  onOpenChange,
}: UserParticipantRolesDialogProps) {
  return (
    <Dialog
      title={`Participants List for ${user.firstName} ${user.lastName}`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      {user.userToParticipantRoles?.find((role) => role.userRoleId === UserRoleId.UID2Support) ? (
        <div>This user has the UID2 support role and has admin access to all participants.</div>
      ) : (
        <div>
          <UserParticipantsTable user={user} userParticipants={userParticipants} />
        </div>
      )}
    </Dialog>
  );
}

export default UserParticipantRolesDialog;
