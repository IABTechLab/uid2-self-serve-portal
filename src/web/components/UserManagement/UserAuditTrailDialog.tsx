import { Suspense, useEffect, useState } from 'react';

import { AuditTrailDTO } from '../../../api/entities/AuditTrail';
import { UserDTO } from '../../../api/entities/User';
import { GetUserAuditTrail } from '../../services/auditTrailService';
import AuditTrailTable from '../AuditTrail/AuditTrailTable';
import { Dialog } from '../Core/Dialog/Dialog';
import { Loading } from '../Core/Loading/Loading';
import { ScreenContentContainer } from '../Core/ScreenContentContainer/ScreenContentContainer';

import './UserAuditTrailDialog.scss';

type UserAuditTrailDialogProps = Readonly<{
  user: UserDTO;
  onOpenChange: () => void;
}>;

function UserAuditTrailDialog({ user, onOpenChange }: UserAuditTrailDialogProps) {
  const [userAuditTrail, setUserAuditTrail] = useState<AuditTrailDTO[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAuditTrail = async () => {
      const auditTrail = await GetUserAuditTrail(user.id);
      setUserAuditTrail(auditTrail);
      setIsLoading(false);
    };
    getAuditTrail();
  }, [user]);

  return (
    <Dialog
      title={`Audit Trail for ${user.firstName} ${user.lastName}`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
      className='audit-trail-dialog'
    >
      {isLoading ? (
        <Loading message='Loading audit trail...' />
      ) : (
        <ScreenContentContainer>
          <Suspense fallback={<Loading message='Loading audit trail...' />}>
            <AuditTrailTable auditTrail={userAuditTrail ?? []} />
          </Suspense>
        </ScreenContentContainer>
      )}
    </Dialog>
  );
}

export default UserAuditTrailDialog;
