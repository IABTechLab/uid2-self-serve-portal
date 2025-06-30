import express from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  httpPut,
  request,
  response,
} from 'inversify-express-utils';

import { TYPES } from '../constant/types';
import { UserRoleId } from '../entities/UserRole';
import { getTraceId } from '../helpers/loggingHelpers';
import { getKcAdminClient } from '../keycloakAdminClient';
import {
  assignApiParticipantMemberRole,
  queryUsersByEmail,
  sendInviteEmailToNewUser,
} from '../services/kcUsersService';
import { LoggerService } from '../services/loggerService';
import * as participantsService from '../services/participantsService';
import {
  SelfResendInvitationSchema,
  UpdateUserRoleIdSchema,
  UserService,
} from '../services/userService';
import * as usersService from '../services/usersService';

@controller('/users')
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.LoggerService) private loggerService: LoggerService
  ) {}

  @httpGet('/current')
  public async getCurrentUser(
    @request() req: usersService.UserRequest,
    @response() res: express.Response
  ): Promise<void> {
    const result = await this.userService.getCurrentUser(req);
    res.json(result);
  }

  @httpGet('/current/participant')
  public async getDefaultParticipant(
    @request() req: usersService.UserRequest,
    @response() res: express.Response
  ): Promise<void> {
    const result = await this.userService.getDefaultParticipant(req);
    res.json(result);
  }

  @httpPut('/current/acceptTerms')
  public async acceptTerms(@request() req: usersService.UserRequest, @response() res: express.Response): Promise<void> {
    const doesUserHaveAParticipant = (req.user?.participants?.length ?? 0) >= 1;

    if (!doesUserHaveAParticipant) {
      res.status(403).json({
        message: 'Unauthorized. You do not have the necessary permissions.',
        errorHash: req.headers.traceId,
      });
    }

    const kcAdminClient = await getKcAdminClient();
    const promises = [
      req.user!.$query().patch({ acceptedTerms: true }),
      assignApiParticipantMemberRole(kcAdminClient, req.user?.email!),
    ];
    await Promise.all(promises);
    res.sendStatus(200);
  }

  @httpPost('/selfResendInvitation')
  public async selfResendInvitation(
    @request() req: usersService.SelfResendInviteRequest,
    @response() res: express.Response
  ): Promise<void> {
    const { email } = SelfResendInvitationSchema.parse(req.body);
    const logger = this.loggerService.getLogger(req);
    const kcAdminClient = await getKcAdminClient();
    const user = await queryUsersByEmail(kcAdminClient, email);
    if (user.length !== 1) {
      res.sendStatus(200);
    }
    logger.info(`Resending invitation email for ${email}, keycloak ID ${user[0].id}`);
    await sendInviteEmailToNewUser(kcAdminClient, user[0]);
    res.sendStatus(200);
  }

  @httpPost('/:userId/resendInvitation')
  public async resendInvitation(
    @request() req: usersService.UserRequest,
    @response() res: express.Response
  ): Promise<void> {
    const logger = this.loggerService.getLogger(req);
    const traceId = getTraceId(req);
    const kcAdminClient = await getKcAdminClient();
    const user = await queryUsersByEmail(kcAdminClient, req.user?.email ?? '');

    const resultLength = user?.length ?? 0;
    if (resultLength < 1) {
      logger.error(`No results received when loading user entry for ${req.user?.email}`);
      res.status(404).json({
        errorHash: traceId,
      });
      return;
    }
    if (resultLength > 1) {
      logger.error(`Multiple results received when loading user entry for ${req.user?.email}`);
      res.status(500).json({
        errorHash: traceId,
      });
      return;
    }

    logger.info(`Resending invitation email for ${req.user?.email}, keycloak ID ${user[0].id}`);
    await sendInviteEmailToNewUser(kcAdminClient, user[0]);
    res.sendStatus(200);
  }

  @httpDelete('/:userId')
  public async removeUser(
    @request() req: participantsService.UserParticipantRequest,
    @response() res: express.Response
  ): Promise<void> {
    const { user, participant } = req;

    if (req.auth?.payload?.email === user?.email) {
      res.status(403).send([{ message: 'You do not have permission to remove yourself.' }]);
      return;
    }
    const usersForParticipant = await usersService.getAllUsersFromParticipant(participant!);
    if (usersForParticipant.length === 1 && usersForParticipant[0].id === user?.id) {
      res.status(403).send([{ message: "You cannot remove a Participant's only user." }]);
      return;
    }

    await this.userService.removeUser(req);
    res.sendStatus(200);
  }

  @httpPatch('/:userId')
  public async updateUser(@request() req: usersService.UserRequest, @response() res: express.Response): Promise<void> {
    const { user } = req;
    const userRoleData = UpdateUserRoleIdSchema.parse(req.body);
    if (req.auth?.payload?.email === user?.email && userRoleData.userRoleId !== UserRoleId.Admin) {
      res
        .status(403)
        .send([
          { message: 'You do not have permission to unassign the Admin role from yourself.' },
        ]);
      return;
    }
    if (
      userRoleData.userRoleId === UserRoleId.UID2Support ||
      userRoleData.userRoleId === UserRoleId.SuperUser
    ) {
      res
        .status(403)
        .send([{ message: 'Unauthorized. You do not have permission to update to this role.' }]);
      return;
    }
    await this.userService.updateUser(req);
    res.sendStatus(200);
  }
}
