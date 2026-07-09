import { jest } from '@jest/globals';
import { Knex } from 'knex';

// jest.unstable_mockModule is NOT hoisted in ESM mode (unlike jest.mock()), so all imports that
// transitively load the mocked modules must be dynamic (placed after the mock registrations).

const mockSendEmail = jest.fn();
const mockGetKcAdminClient = jest.fn(() => ({}));
const mockDoesUserExistInKeycloak = jest.fn();
const mockCreateNewUser = jest.fn(() => ({ id: 'kc-user-id' }));
const mockSendInviteEmailToNewUser = jest.fn();
const mockAssignApiParticipantMemberRole = jest.fn();

jest.unstable_mockModule('./kcUsersService', () => ({
  doesUserExistInKeycloak: mockDoesUserExistInKeycloak,
  createNewUser: mockCreateNewUser,
  sendInviteEmailToNewUser: mockSendInviteEmailToNewUser,
  assignApiParticipantMemberRole: mockAssignApiParticipantMemberRole,
}));

jest.unstable_mockModule('../keycloakAdminClient', () => ({
  getKcAdminClient: mockGetKcAdminClient,
}));

jest.unstable_mockModule('./emailService', () => ({
  createEmailService: jest.fn(() => ({ sendEmail: mockSendEmail })),
}));

// Dynamic imports must come AFTER jest.unstable_mockModule registrations so that when these
// modules are loaded they pick up the mocked dependencies (emailService, kcUsersService, etc.)
const { TestConfigure } = await import('../../database/TestSelfServeDatabase');
const { createParticipant, createUser } = await import('../../testHelpers/apiTestHelpers');
const { inviteUserToParticipant } = await import('./usersService');
const { UserJobFunction } = await import('../entities/User');
const { UserRoleId } = await import('../entities/UserRole');

const traceId = { traceId: 'test-trace-id', uidTraceId: 'test-uid-trace-id' };

const internalUserPartial = {
  email: 'engineer@unifiedid.com',
  firstName: 'Internal',
  lastName: 'User',
  jobFunction: UserJobFunction.Engineering,
};

const externalUserPartial = {
  email: 'user@external.com',
  firstName: 'External',
  lastName: 'User',
  jobFunction: UserJobFunction.DA,
};

describe('inviteUserToParticipant', () => {
  let knex: Knex;

  beforeEach(async () => {
    knex = await TestConfigure();
    jest.clearAllMocks();
  });

  describe('user already exists in portal DB (existing user path)', () => {
    it('sends invite email to an existing internal user added to a new org', async () => {
      // Replicates the reported bug: internal user invited to Platform Support Org
      // receives no notification because addAndInviteUserToParticipant had an
      // isUid2Internal guard that blocked sendInviteEmailToExistingUser.
      const participant = await createParticipant(knex, { name: 'Platform Support' });
      const existingOtherParticipant = await createParticipant(knex, {});
      await createUser({
        email: internalUserPartial.email,
        participantToRoles: [{ participantId: existingOtherParticipant.id }],
      });

      await inviteUserToParticipant(internalUserPartial, participant, UserRoleId.Admin, traceId);

      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: internalUserPartial.email,
          template: 'inviteExistingUserToParticipant',
          templateData: expect.objectContaining({ participantName: 'Platform Support' }),
        }),
        traceId
      );
      expect(mockSendInviteEmailToNewUser).not.toHaveBeenCalled();
    });

    it('sends invite email to an existing external user added to a new org', async () => {
      const participant = await createParticipant(knex, { name: 'Acme Corp' });
      const existingOtherParticipant = await createParticipant(knex, {});
      await createUser({
        email: externalUserPartial.email,
        participantToRoles: [{ participantId: existingOtherParticipant.id }],
      });

      await inviteUserToParticipant(externalUserPartial, participant, UserRoleId.Admin, traceId);

      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: externalUserPartial.email,
          template: 'inviteExistingUserToParticipant',
        }),
        traceId
      );
      expect(mockSendInviteEmailToNewUser).not.toHaveBeenCalled();
    });
  });

  describe('user does not exist in portal DB (new user path)', () => {
    it('sends KC password-setup email to a brand-new external user not in Keycloak', async () => {
      const participant = await createParticipant(knex, {});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockDoesUserExistInKeycloak as any).mockResolvedValue(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockCreateNewUser as any).mockResolvedValue({ id: 'new-kc-id' });

      await inviteUserToParticipant(externalUserPartial, participant, UserRoleId.Admin, traceId);

      expect(mockSendInviteEmailToNewUser).toHaveBeenCalled();
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it('sends invite email (not KC password email) to an internal SSO user who exists in Keycloak but not the portal', async () => {
      // Replicates the bug: an SSO user who has never accessed the portal is invited.
      // Before the fix, inviteUserToParticipant always called createAndInviteKeycloakUser
      // regardless of KC existence, which sent no email for internal users (isUid2Internal guard).
      // After the fix, it checks KC first and sends sendInviteEmailToExistingUser instead.
      const participant = await createParticipant(knex, { name: 'Platform Support' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockDoesUserExistInKeycloak as any).mockResolvedValue(true);

      await inviteUserToParticipant(internalUserPartial, participant, UserRoleId.Admin, traceId);

      expect(mockSendInviteEmailToNewUser).not.toHaveBeenCalled();
      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: internalUserPartial.email,
          template: 'inviteExistingUserToParticipant',
          templateData: expect.objectContaining({ participantName: 'Platform Support' }),
        }),
        traceId
      );
      expect(mockAssignApiParticipantMemberRole).toHaveBeenCalled();
    });

    it('sends invite email (not KC password email) to an external user who already exists in Keycloak', async () => {
      const participant = await createParticipant(knex, { name: 'Acme Corp' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockDoesUserExistInKeycloak as any).mockResolvedValue(true);

      await inviteUserToParticipant(externalUserPartial, participant, UserRoleId.Admin, traceId);

      expect(mockSendInviteEmailToNewUser).not.toHaveBeenCalled();
      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: externalUserPartial.email,
          template: 'inviteExistingUserToParticipant',
        }),
        traceId
      );
    });

    it('sends invite email to a brand-new internal user not yet in Keycloak', async () => {
      // createAndInviteKeycloakUser skips KC email for internal users (isUid2Internal guard),
      // so sendInviteEmailToExistingUser must fire as the fallback notification.
      const participant = await createParticipant(knex, { name: 'Platform Support' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockDoesUserExistInKeycloak as any).mockResolvedValue(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockCreateNewUser as any).mockResolvedValue({ id: 'new-kc-id' });

      await inviteUserToParticipant(internalUserPartial, participant, UserRoleId.Admin, traceId);

      expect(mockSendInviteEmailToNewUser).not.toHaveBeenCalled();
      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: internalUserPartial.email,
          template: 'inviteExistingUserToParticipant',
        }),
        traceId
      );
    });
  });
});
