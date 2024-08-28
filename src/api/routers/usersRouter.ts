import express from 'express';

import { UserController } from '../controllers/userController';
import { enrichCurrentUser } from '../middleware/usersMiddleware';
import { LoggerService } from '../services/loggerService';
import { UserService } from '../services/userService';

const createUsersRouter = () => {
  const usersRouter = express.Router();
  const userController = new UserController(new UserService(), new LoggerService());

  usersRouter.use('/current', enrichCurrentUser);
  usersRouter.get('/current', userController.getCurrentUser.bind(userController));
  usersRouter.put('/current/acceptTerms', userController.acceptTerms.bind(userController));
  usersRouter.get(
    '/current/participant',
    userController.getCurrentParticipant.bind(userController)
  );
  usersRouter.post(
    '/selfResendInvitation',
    userController.selfResendInvitation.bind(userController)
  );

  return usersRouter;
};

export { createUsersRouter };
