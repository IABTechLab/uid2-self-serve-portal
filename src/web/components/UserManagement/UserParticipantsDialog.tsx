import { useEffect, useState } from 'react';

import { ParticipantDTO } from '../../../api/entities/Participant';
import { UserDTO } from '../../../api/entities/User';
import { UserRoleId } from '../../../api/entities/UserRole';
import { GetUserParticipants } from '../../services/participant';
import { Dialog } from '../Core/Dialog/Dialog';
import { Loading } from '../Core/Loading/Loading';
import UserParticipantsTable from './UserPartcipantsTable';

type UserParticipantsDialogProps = Readonly<{
  user: UserDTO;
  onOpenChange: () => void;
}>;

function UserParticipantsDialog({ user, onOpenChange }: UserParticipantsDialogProps) {
  const [userParticipants, setUserParticipants] = useState<ParticipantDTO[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getParticipants = async () => {
      const participants = await GetUserParticipants(user.id);
      setUserParticipants(participants);
      setIsLoading(false);
    };
    getParticipants();
  }, [user]);

  return (
    <Dialog
      title={`Participants List for ${user.firstName} ${user.lastName}`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      {isLoading ? (
        <Loading message='Loading participants...' />
      ) : (
        <div>
          {user.userToParticipantRoles?.find(
            (role) => role.userRoleId === UserRoleId.UID2Support
          ) ? (
            <div>This user has the UID2 support role and has admin access to all participants.</div>
          ) : (
            <div>
              <UserParticipantsTable user={user} userParticipants={userParticipants ?? []} />
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}

export default UserParticipantsDialog;
