import express from 'express';

import { UserController } from '../controllers/userController';
import { isAdminOrUid2Support } from '../middleware/userRoleMiddleware';
import { verifyAndEnrichUser } from '../middleware/usersMiddleware';
import { LoggerService } from '../services/loggerService';
import { UserService } from '../services/userService';

const createParticipantUsersRouter = () => {
  const participantUsersRouter = express.Router({ mergeParams: true });
  const userController = new UserController(new UserService(), new LoggerService());

  participantUsersRouter.use('/:userId', verifyAndEnrichUser, isAdminOrUid2Support);
  participantUsersRouter.post(
    '/:userId/resendInvitation',
    userController.resendInvitation.bind(userController)
  );
  participantUsersRouter.delete('/:userId', userController.removeUser.bind(userController));
  participantUsersRouter.patch('/:userId', userController.updateUser.bind(userController));

  return participantUsersRouter;
};

export { createParticipantUsersRouter };
