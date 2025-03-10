import { Suspense } from 'react';

import { AuditTrailDTO } from '../../../api/entities/AuditTrail';
import { UserDTO } from '../../../api/entities/User';
import AuditTrailTable from '../AuditTrail/AuditTrailTable';
import { Dialog } from '../Core/Dialog/Dialog';
import { Loading } from '../Core/Loading/Loading';
import { ScreenContentContainer } from '../Core/ScreenContentContainer/ScreenContentContainer';

import './UserAuditTrailDialog.scss';

type UserAuditTrailDialogProps = Readonly<{
  user: UserDTO;
  userAuditTrail: AuditTrailDTO[];
  onOpenChange: () => void;
}>;

function UserAuditTrailDialog({ user, userAuditTrail, onOpenChange }: UserAuditTrailDialogProps) {
  return (
    <Dialog
      title={`Audit Trail for ${user.firstName} ${user.lastName}`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
      className='audit-trail-dialog'
    >
      <ScreenContentContainer>
        <Suspense fallback={<Loading message='Loading audit trail...' />}>
          <AuditTrailTable auditTrail={userAuditTrail} />
        </Suspense>
      </ScreenContentContainer>
    </Dialog>
  );
}

export default UserAuditTrailDialog;
