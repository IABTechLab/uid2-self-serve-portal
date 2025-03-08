import { FormProvider } from 'react-hook-form';

import { UserDTO } from '../../../api/entities/User';
import { Dialog } from '../Core/Dialog/Dialog';
import { RootFormErrors } from '../Input/FormError';
import { TextInput } from '../Input/TextInput';

type UserParticipantRolesDialogProps = Readonly<{
  user: UserDTO;
  onOpenChange: () => void;
}>;

function UserParticipantRolesDialog({ user, onOpenChange }: UserParticipantRolesDialogProps) {
  console.log(user);
  return (
    <Dialog
      title={`Participants for ${user.firstName} ${user.lastName}`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      {user.userToParticipantRoles?.map((role) => {
        console.log(user.userToParticipantRoles);
        return (
          <div key={role.participantId}>
            {role.userRoleId} {role.participantId}
          </div>
        );
      })}
    </Dialog>
  );
}

export default UserParticipantRolesDialog;
