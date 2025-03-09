import { ParticipantDTO } from '../../../api/entities/Participant';
import { UserDTO } from '../../../api/entities/User';
import { UserRoleId } from '../../../api/entities/UserRole';
import { Dialog } from '../Core/Dialog/Dialog';

type UserParticipantRolesDialogProps = Readonly<{
  user: UserDTO;
  usersParticipants: ParticipantDTO[];
  onOpenChange: () => void;
}>;

function UserParticipantRolesDialog({
  user,
  usersParticipants,
  onOpenChange,
}: UserParticipantRolesDialogProps) {
  return (
    <Dialog
      title={`Participants List for ${user.firstName} ${user.lastName}`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      {user.userToParticipantRoles?.find((role) => role.userRoleId === UserRoleId.UID2Support) ? (
        <div>This user has the UID2 support role and has access to all participants.</div>
      ) : (
        <div>
          {user.userToParticipantRoles?.map((role) => {
            return (
              <div key={role.participantId}>
                {usersParticipants.find((p) => p.id === role.participantId)?.name}{' '}
                {UserRoleId[role.userRoleId]}
              </div>
            );
          })}
        </div>
      )}
    </Dialog>
  );
}

export default UserParticipantRolesDialog;
