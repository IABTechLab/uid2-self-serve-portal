import express from 'express';

import { UserController } from '../controllers/userController';
import { isAdminOrUid2SupportCheck } from '../middleware/userRoleMiddleware';
import { verifyAndEnrichUser } from '../middleware/usersMiddleware';
import { LoggerService } from '../services/loggerService';
import { UserService } from '../services/userService';

const createParticipantUsersRouter = () => {
  const participantUsersRouter = express.Router({ mergeParams: true });
  const userController = new UserController(new UserService(), new LoggerService());

  participantUsersRouter.use('/:userId', verifyAndEnrichUser);
  participantUsersRouter.post(
    '/:userId/resendInvitation',
    isAdminOrUid2SupportCheck,
    userController.resendInvitation.bind(userController)
  );
  participantUsersRouter.delete(
    '/:userId',
    isAdminOrUid2SupportCheck,
    userController.removeUser.bind(userController)
  );
  participantUsersRouter.patch(
    '/:userId',
    isAdminOrUid2SupportCheck,
    userController.updateUser.bind(userController)
  );

  return participantUsersRouter;
};

export { createParticipantUsersRouter };
