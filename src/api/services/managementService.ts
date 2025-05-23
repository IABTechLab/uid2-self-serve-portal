import { AuditAction, AuditTrailEvents } from '../entities/AuditTrail';
import { User } from '../entities/User';
import { getTraceId } from '../helpers/loggingHelpers';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from './auditTrailService';
import { UserParticipantRequest } from './participantsService';
import { findUserByEmail } from './usersService';

export const getAllUsersList = async () => {
  const userList = await User.query()
    .where('deleted', 0)
    .orderBy('email')
    .withGraphFetched('userToParticipantRoles');
  return userList;
};

export const getUserById = async (userId: number) => {
  const user = await User.query().where('id', userId).first();
  return user;
};

export const updateUserLock = async (
  req: UserParticipantRequest,
  userId: number,
  isLocked: boolean
) => {
  const requestingUser = await findUserByEmail(req.auth?.payload.email as string);
  const updatedUser = await User.query().where('id', userId).first();
  const traceId = getTraceId(req);

  const auditTrailInsertObject = constructAuditTrailObject(
    requestingUser!,
    AuditTrailEvents.ChangeUserLock,
    {
      action: AuditAction.Update,
      email: updatedUser?.email,
      locked: isLocked,
    }
  );

  await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
    await User.query().where('id', userId).update({ locked: isLocked });
  });
};
