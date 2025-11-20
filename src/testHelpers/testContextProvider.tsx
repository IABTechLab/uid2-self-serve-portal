import { PropsWithChildren } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';

import { ParticipantDTO } from '../api/entities/Participant';
import { UserWithParticipantRoles } from '../api/services/usersService';
import { CurrentUserContext, UserContextWithSetter } from '../web/contexts/CurrentUserProvider';
import { ParticipantContext, ParticipantWithSetter } from '../web/contexts/ParticipantProvider';

export const createUserContextValue = (user: UserWithParticipantRoles): UserContextWithSetter => ({
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
  loadParticipant: async () => {},
});

const defaultUserContext: UserContextWithSetter = {
  LoggedInUser: null,
  loadUser: async () => {},
};

const defaultParticipantContext: ParticipantWithSetter = {
  participant: null,
  setParticipant: () => {},
  loadParticipant: async () => {},
};

interface TestContextProviderProps extends PropsWithChildren {
  participantContextValue?: ParticipantWithSetter;
  userContextValue?: UserContextWithSetter;
}

const mockOidcConfig = {
  authority: 'http://localhost:8080/realms/test',
  client_id: 'test-client', // eslint-disable-line camelcase
  redirect_uri: 'http://localhost:3000', // eslint-disable-line camelcase
};

export function TestContextProvider({
  children,
  participantContextValue,
  userContextValue,
}: TestContextProviderProps) {
  return (
    <AuthProvider {...mockOidcConfig}>
      <ParticipantContext.Provider value={participantContextValue ?? defaultParticipantContext}>
        <CurrentUserContext.Provider value={userContextValue ?? defaultUserContext}>
          <BrowserRouter>{children}</BrowserRouter>
        </CurrentUserContext.Provider>
      </ParticipantContext.Provider>
    </AuthProvider>
  );
}

export function TestContextProviderWithoutKeycloak({
  children,
  participantContextValue,
  userContextValue,
}: TestContextProviderProps) {
  return (
    <ParticipantContext.Provider value={participantContextValue ?? defaultParticipantContext}>
      <CurrentUserContext.Provider value={userContextValue ?? defaultUserContext}>
        <BrowserRouter>{children}</BrowserRouter>
      </CurrentUserContext.Provider>
    </ParticipantContext.Provider>
  );
}
