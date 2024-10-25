import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';
import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ParticipantDTO } from '../api/entities/Participant';
import { UserWithIsUid2Support } from '../api/services/usersService';
import { CurrentUserContext, UserContextWithSetter } from '../web/contexts/CurrentUserProvider';
import { ParticipantContext, ParticipantWithSetter } from '../web/contexts/ParticipantProvider';

export const createTestKeycloakInstance = () => {
  return new Keycloak();
};

export const createUserContextValue = (user: UserWithIsUid2Support): UserContextWithSetter => ({
  LoggedInUser: {
    profile: {},
    user,
  },
  loadUser: async () => {},
});

export const createParticipantContextValue = (
  participant: ParticipantDTO
): ParticipantWithSetter => ({
  participant,
  setParticipant: () => {},
});

const defaultUserContext: UserContextWithSetter = {
  LoggedInUser: null,
  loadUser: async () => {},
};

const defaultParticipantContext: ParticipantWithSetter = {
  participant: null,
  setParticipant: () => {},
};

interface TestContextProviderProps extends PropsWithChildren {
  participantContextValue?: ParticipantWithSetter;
  userContextValue?: UserContextWithSetter;
}

export function TestContextProvider({
  children,
  participantContextValue,
  userContextValue,
}: TestContextProviderProps) {
  return (
    <ReactKeycloakProvider authClient={createTestKeycloakInstance()}>
      <ParticipantContext.Provider value={participantContextValue ?? defaultParticipantContext}>
        <CurrentUserContext.Provider value={userContextValue ?? defaultUserContext}>
          <BrowserRouter>{children}</BrowserRouter>
        </CurrentUserContext.Provider>
      </ParticipantContext.Provider>
    </ReactKeycloakProvider>
  );
}
