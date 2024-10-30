import { ParticipantDTO } from '../../../api/entities/Participant';
import { UserWithParticipantRoles } from '../../../api/services/usersService';
import { UserAccount } from '../../services/userAccount';
import { isUserOperations } from '../../utils/userRoleHelpers';
import { VersionedTourStep } from './tourSteps';

export const compareVersions = (a: string, b: string): number => {
  const parsedA = a.split('.').map((v) => parseInt(v, 10));
  const parsedB = b.split('.').map((v) => parseInt(v, 10));
  for (let versionPart = 0; versionPart < parsedA.length; versionPart++) {
    if (parsedA[versionPart] !== parsedB[versionPart])
      return parsedA[versionPart] - parsedB[versionPart];
  }
  return 0;
};

export const shouldRemoveParticipantSwitcherStep = (
  user: UserWithParticipantRoles | null | undefined
) => {
  return (user?.participants?.length ?? 0) <= 1;
};

export const shouldRemoveAuditTrailStep = (
  user: UserWithParticipantRoles | null | undefined,
  participant: ParticipantDTO | null
) => {
  if (!user || !participant) {
    return true;
  }
  return isUserOperations(user, participant.id);
};

export function shouldRemoveCurrentStep(
  step: VersionedTourStep,
  loggedInUser: UserAccount | null,
  participant: ParticipantDTO | null
) {
  if (step?.title === `Participant Switcher`) {
    return shouldRemoveParticipantSwitcherStep(loggedInUser?.user);
  }
  if (step?.title === 'Audit Trail') {
    return shouldRemoveAuditTrailStep(loggedInUser?.user, participant);
  }
  return false;
}
