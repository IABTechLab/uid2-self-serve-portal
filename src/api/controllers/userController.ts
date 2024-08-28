import { Response } from 'express';
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
import { Participant, ParticipantStatus } from '../entities/Participant';
import { getTraceId } from '../helpers/loggingHelpers';
import { getKcAdminClient } from '../keycloakAdminClient';
import {
  assignClientRoleToUser,
  queryUsersByEmail,
  sendInviteEmail,
} from '../services/kcUsersService';
import { LoggerService } from '../services/loggerService';
import { SelfResendInvitationParser, UserService } from '../services/userService';
import { SelfResendInviteRequest, UserRequest } from '../services/usersService';

@controller('/users')
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.LoggerService) private loggerService: LoggerService
  ) {}

  @httpGet('/current')
  public async getCurrentUser(
    @request() req: UserRequest,
    @response() res: Response
  ): Promise<void> {
    const result = await this.userService.getCurrentUser(req);
    res.json(result);
  }

  @httpGet('/current/participant')
  public async getDefaultParticipant(
    @request() req: UserRequest,
    @response() res: Response
  ): Promise<void> {
    const result = await this.userService.getDefaultParticipant(req);
    res.json(result);
  }

  @httpPut('/current/acceptTerms')
  public async acceptTerms(@request() req: UserRequest, @response() res: Response): Promise<void> {
    // TODO: This just gets the user's first participant, but it will need to get the currently selected participant as part of UID2-3989
    const currentParticipantId = req.user?.participants?.[0].id;
    const participant = currentParticipantId
      ? await Participant.query().findById(currentParticipantId)
      : undefined;

    if (!participant || participant.status !== ParticipantStatus.Approved) {
      res.status(403).json({
        message: 'Unauthorized. You do not have the necessary permissions.',
        errorHash: req.headers.traceId,
      });
    }

    const kcAdminClient = await getKcAdminClient();
    const promises = [
      req.user!.$query().patch({ acceptedTerms: true }),
      assignClientRoleToUser(kcAdminClient, req.user?.email!, 'api-participant-member'),
    ];
    await Promise.all(promises);
    res.sendStatus(200);
  }

  @httpPost('/selfResendInvitation')
  public async selfResendInvitation(
    @request() req: SelfResendInviteRequest,
    @response() res: Response
  ): Promise<void> {
    const { email } = SelfResendInvitationParser.parse(req.body);
    const logger = this.loggerService.getLogger(req);
    const kcAdminClient = await getKcAdminClient();
    const user = await queryUsersByEmail(kcAdminClient, email);
    if (user.length !== 1) {
      res.sendStatus(200);
    }
    logger.info(`Resending invitation email for ${email}, keycloak ID ${user[0].id}`);
    await sendInviteEmail(kcAdminClient, user[0]);
    res.sendStatus(200);
  }

  @httpPost('/:userId/resendInvitation')
  public async resendInvitation(
    @request() req: UserRequest,
    @response() res: Response
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
    await sendInviteEmail(kcAdminClient, user[0]);
    res.sendStatus(200);
  }

  @httpDelete('/:userId')
  public async deleteUser(@request() req: UserRequest, @response() res: Response): Promise<void> {
    const { user } = req;

    if (req.auth?.payload?.email === user?.email) {
      res.status(403).send([{ message: 'You do not have permission to delete yourself.' }]);
    }

    await this.userService.deleteUser(req);
    res.sendStatus(200);
  }

  @httpPatch('/:userId')
  public async updateUser(@request() req: UserRequest, @response() res: Response): Promise<void> {
    await this.userService.updateUser(req);
    res.sendStatus(200);
  }
}
