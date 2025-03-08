import { Suspense, useEffect, useState } from 'react';
import { defer, useLoaderData } from 'react-router-dom';
import { makeLoader } from 'react-router-typesafe';

import { AuditTrailDTO } from '../../../api/entities/AuditTrail';
import { User, UserDTO } from '../../../api/entities/User';
import { GetUserAuditTrail } from '../../../api/services/auditTrailService';
import { GetParticipantAuditTrail } from '../../services/auditTrailService';
import { AwaitTypesafe } from '../../utils/AwaitTypesafe';
import { makeParticipantLoader } from '../../utils/loaderHelpers';
import AuditTrailTable from '../AuditTrail/AuditTrailTable';
import { Dialog } from '../Core/Dialog/Dialog';
import { Loading } from '../Core/Loading/Loading';
import { ScreenContentContainer } from '../Core/ScreenContentContainer/ScreenContentContainer';

type UserParticipantRolesDialogProps = Readonly<{
  user: UserDTO;
  onOpenChange: () => void;
}>;

function UserAuditTrailDialog({ user, onOpenChange }: UserParticipantRolesDialogProps) {
  const [auditTrail, setAuditTrail] = useState<AuditTrailDTO[]>([]);

  useEffect(() => {
    const getat = async () => {
      const u = user as User;
      const at = await GetUserAuditTrail(u);
      setAuditTrail(at);
    };
    getat();
  });

  return (
    <Dialog
      title={`Audit Trail for ${user.firstName} ${user.lastName}`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      <ScreenContentContainer>
        <Suspense fallback={<Loading message='Loading audit trail...' />}>
          <AuditTrailTable auditTrail={auditTrail} />
        </Suspense>
      </ScreenContentContainer>
    </Dialog>
  );
}

export default UserAuditTrailDialog;
