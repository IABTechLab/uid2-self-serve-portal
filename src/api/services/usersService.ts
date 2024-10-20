import { Request } from 'express';

import { Participant, ParticipantDTO } from '../entities/Participant';
import { User, UserDTO } from '../entities/User';
import { UserRole, UserRoleId } from '../entities/UserRole';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';
import { SSP_WEB_BASE_URL } from '../envars';
import { getKcAdminClient } from '../keycloakAdminClient';
import { isUserAnApprover } from './approversService';
import { createEmailService } from './emailService';
import { EmailArgs } from './emailTypes';
import {
  assignApiParticipantMemberRole,
  createNewUser,
  sendInviteEmailToNewUser,
} from './kcUsersService';

export interface UserRequest extends Request {
  user?: User;
}

export interface SiteRequest extends Request {
  siteId?: number;
}

export interface SelfResendInviteRequest extends Request {
  email?: string;
}

export type UserWithIsApprover = UserDTO & { isApprover: boolean };
export type UserWithCurrentParticipantRoleNames = UserDTO & {
  currentParticipantUserRoleNames?: string[];
};

export type UserPartialDTO = Omit<UserDTO, 'id' | 'acceptedTerms'>;

const simplifyUserParticipantRoles = (user: User) => {
  return (
    user.participants?.map((participant) => {
      const { participantToUserRoles, ...rest } = participant;

      const currentUserRoleIds = participantToUserRoles
        ?.filter((mapping) => mapping.userId === user.id)
        .map((role) => role.userRoleId);

      return Participant.fromJson({
        ...rest,
        currentUserRoleIds,
      });
    }) || []
  );
};

const deduplicateParticipants = (participants: Participant[]) => {
  const seenIds = new Set<number>();
  return participants.filter((participant) => {
    if (seenIds.has(participant.id)) {
      return false;
    }
    seenIds.add(participant.id);
    return true;
  });
};

const simplifyUserParticipants = (user: User) => {
  if (!user?.participants) {
    return;
  }
  const simplifiedParticipants = simplifyUserParticipantRoles(user);
  return deduplicateParticipants(simplifiedParticipants);
};

export const findUserByEmail = async (email: string) => {
  const user = await User.query()
    .findOne('email', email)
    .where('deleted', 0)
    .modify('withParticipants');

  if (user?.participants) {
    user.participants = simplifyUserParticipants(user);
  }

  return user;
};

export const enrichUserWithIsApprover = async (user: User) => {
  const userIsApprover = await isUserAnApprover(user.email);
  return {
    ...user,
    isApprover: userIsApprover,
  };
};

const usersWithCurrentParticipantUserRoleNames = async (users: User[], participantId: number) => {
  const userRoles = await UserRole.query();
  return users.map((user) => {
    const { userToParticipantRoles, ...rest } = user;
    return {
      ...rest,
      currentParticipantUserRoleNames: user?.userToParticipantRoles
        ?.filter((x) => x.participantId === participantId)
        .map((y) => {
          const role = userRoles.find((r) => r.id === y.userRoleId);
          return role ? role.roleName : null;
        }),
    };
  });
};

export const getAllUsersFromParticipantWithRoles = async (participant: Participant) => {
  const participantUserIds = (
    await UserToParticipantRole.query().where('participantId', participant.id)
  ).map((userToParticipantRole) => userToParticipantRole.userId);

  const usersWithParticipants = await User.query()
    .whereIn('id', participantUserIds)
    .where('deleted', 0)
    .withGraphFetched('userToParticipantRoles');

  return usersWithCurrentParticipantUserRoleNames(usersWithParticipants, participant.id);
};

export const getAllUsersFromParticipant = async (participant: Participant) => {
  const participantUserIds = (
    await UserToParticipantRole.query().where('participantId', participant.id)
  ).map((userToParticipantRole) => userToParticipantRole.userId);

  return User.query().whereIn('id', participantUserIds).where('deleted', 0);
};

export const sendInviteEmailToExistingUser = (
  participantName: string,
  existingUser: UserDTO,
  traceId: string
) => {
  const emailService = createEmailService();
  const emailArgs: EmailArgs = {
    subject: `You have been invited to join ${participantName} in the UID2 Portal`,
    templateData: {
      participantName,
      firstName: existingUser.firstName,
      link: SSP_WEB_BASE_URL,
    },
    template: 'inviteExistingUserToParticipant',
    to: existingUser.email,
  };
  emailService.sendEmail(emailArgs, traceId);
};

export const createAndInviteKeycloakUser = async (
  firstName: string,
  lastName: string,
  email: string
) => {
  const kcAdminClient = await getKcAdminClient();
  const newUser = await createNewUser(kcAdminClient, firstName, lastName, email);
  await assignApiParticipantMemberRole(kcAdminClient, email);

  await sendInviteEmailToNewUser(kcAdminClient, newUser);
};

const addAndInviteUserToParticipant = async (
  existingUser: UserDTO,
  participant: ParticipantDTO,
  traceId: string
) => {
  await UserToParticipantRole.query().insert({
    userId: existingUser.id,
    participantId: participant.id,
    userRoleId: UserRoleId.Admin,
  });
  sendInviteEmailToExistingUser(participant.name, existingUser, traceId);
};

const createUserInPortal = async (user: UserPartialDTO, participantId: number) => {
  const newUser = await User.transaction(async (trx) => {
    const createdUser = await User.query(trx).insert(user);
    // Update the user/participant/role mapping
    await UserToParticipantRole.query(trx).insert({
      userId: createdUser?.id,
      participantId,
      userRoleId: UserRoleId.Admin,
    });
    return createdUser;
  });
  return newUser;
};

export const inviteUserToParticipant = async (
  userPartial: UserPartialDTO,
  participant: ParticipantDTO,
  traceId: string
) => {
  const existingUser = await findUserByEmail(userPartial.email);
  if (existingUser) {
    await addAndInviteUserToParticipant(existingUser, participant, traceId);
  } else {
    const { firstName, lastName, email } = userPartial;
    await createAndInviteKeycloakUser(firstName, lastName, email);
    await createUserInPortal(userPartial, participant!.id);
  }
};
