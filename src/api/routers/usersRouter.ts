import express, { Response } from 'express';

import { UserController } from '../controllers/userController';
import { isSuperUserCheck } from '../middleware/userRoleMiddleware';
import { enrichCurrentUser } from '../middleware/usersMiddleware';
import { LoggerService } from '../services/loggerService';
import { getCurrentUser, UserService } from '../services/userService';
import { UserRequest } from '../services/usersService';

const handleGetCurrentUser = async (req: UserRequest, res: Response) => {
  const result = await getCurrentUser(req);
  return res.json(result);
};

const createUsersRouter = () => {
  const usersRouter = express.Router();
  const userController = new UserController(new UserService(), new LoggerService());

  usersRouter.use('/current', enrichCurrentUser);
  usersRouter.get('/current', handleGetCurrentUser);
  usersRouter.put('/current/acceptTerms', userController.acceptTerms.bind(userController));
  usersRouter.get(
    '/current/participant',
    userController.getDefaultParticipant.bind(userController)
  );
  usersRouter.post(
    '/selfResendInvitation',
    userController.selfResendInvitation.bind(userController)
  );

  usersRouter.post(
    '/resetPassword',
    isSuperUserCheck,
    userController.resetPassword.bind(userController)
  );

  return usersRouter;
};

export { createUsersRouter };
