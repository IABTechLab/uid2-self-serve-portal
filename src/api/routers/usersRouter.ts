import express from 'express';

import { UserController } from '../controllers/userController';
import {  UserService } from '../services/userService';
import { enrichCurrentUser, enrichWithUserFromParams } from '../services/usersService';

const createUsersRouter = () => {
  const usersRouter = express.Router();
  const userController = new UserController(new UserService());

  usersRouter.use('/current', enrichCurrentUser);
  usersRouter.get('/current', userController.getCurrentUser.bind(userController));
  usersRouter.put('/current/acceptTerms', userController.acceptTerms.bind(userController));
  usersRouter.get(
    '/current/participant',
    userController.getCurrentParticipant.bind(userController)
  );
  usersRouter.use('/:userId', enrichWithUserFromParams);
  usersRouter.get('/:userId', userController.getUserById.bind(userController));
  usersRouter.post(
    '/:userId/resendInvitation',
    userController.resendInvitation.bind(userController)
  );
  usersRouter.delete('/:userId', userController.deleteUser.bind(userController));
  usersRouter.patch('/:userId', userController.updateUser.bind(userController));

  return usersRouter;
};

export { createUsersRouter };
