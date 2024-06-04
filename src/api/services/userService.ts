import { injectable } from 'inversify';
import { z } from 'zod';

import { Participant } from '../entities/Participant';
import { ParticipantType } from '../entities/ParticipantType';
import { UserRole } from '../entities/User';
import { mapClientTypeToParticipantType } from '../helpers/siteConvertingHelpers';
import { getSite } from './adminServiceClient';
import { getApiRoles } from './apiKeyService';
import { enrichUserWithIsApprover, findUserByEmail, UserRequest } from './usersService';

export type DeletedUser = {
  email: string;
  participantId: number | null;
  deleted: boolean;
};

export const UpdateUserParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(UserRole),
});

export const SelfResendInvitationParser = z.object({ email: z.string() });

@injectable()
export class UserService {
  public async getCurrentUser(req: UserRequest) {
    const userEmail = req.auth?.payload?.email as string;
    const user = await findUserByEmail(userEmail);
    const userWithIsApprover = await enrichUserWithIsApprover(user!);
    return userWithIsApprover;
  }

  public async getCurrentParticipant(req: UserRequest) {
    const currentParticipant = await Participant.query().findOne({
      id: req.user!.participantId,
    });
    const currentSite = !currentParticipant?.siteId
      ? undefined
      : await getSite(currentParticipant?.siteId);
    const apiRoles = await getApiRoles(currentParticipant!);
    const allParticipantTypes = await ParticipantType.query();
    const result = {
      ...currentParticipant,
      types: mapClientTypeToParticipantType(currentSite?.clientTypes || [], allParticipantTypes),
      apiRoles,
    };
    return result;
  }
}
