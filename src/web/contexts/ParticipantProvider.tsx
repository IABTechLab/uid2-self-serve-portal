import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ParticipantDTO } from '../../api/entities/Participant';
import { Loading } from '../components/Core/Loading/Loading';
import { GetSelectedParticipant, GetUsersDefaultParticipant } from '../services/participant';
import { ApiError } from '../utils/apiError';
import { useAsyncThrowError } from '../utils/errorHandler';
import { parseParticipantId } from '../utils/urlHelpers';
import { CurrentUserContext } from './CurrentUserProvider';

export type ParticipantWithSetter = {
  participant: ParticipantDTO | null;
  setParticipant: (participant: ParticipantDTO) => void;
};

export type UserIdParticipantId = {
  [key: string]: number;
};

export const ParticipantContext = createContext<ParticipantWithSetter>({
  participant: null,
  setParticipant: () => {},
});

function ParticipantProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [participant, setParticipant] = useState<ParticipantDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { LoggedInUser } = useContext(CurrentUserContext);

  const throwError = useAsyncThrowError();
  const user = LoggedInUser?.user ?? null;
  const { participantId } = useParams();

  let currentParticipantId = parseParticipantId(participantId);

  useEffect(() => {
    const loadParticipant = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const lastSelectedParticipantIds = (JSON.parse(
            localStorage.getItem('lastSelectedParticipantIds') ?? '{}'
          ) ?? {}) as UserIdParticipantId;

          if (!currentParticipantId) {
            currentParticipantId = lastSelectedParticipantIds[user.id];
          }

          const p = currentParticipantId
            ? await GetSelectedParticipant(currentParticipantId)
            : await GetUsersDefaultParticipant();
          setParticipant(p);
          lastSelectedParticipantIds[user.id] = p.id;
          localStorage.setItem(
            'lastSelectedParticipantIds',
            JSON.stringify(lastSelectedParticipantIds)
          );
        }
      } catch (e: unknown) {
        if (e instanceof ApiError) throwError(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (!participant || currentParticipantId !== participant?.id) loadParticipant();
  }, [user, participant, throwError, currentParticipantId]);

  const participantContext = useMemo(
    () => ({
      participant,
      setParticipant,
    }),
    [participant]
  );
  return (
    <ParticipantContext.Provider value={participantContext}>
      {isLoading ? <Loading /> : children}
    </ParticipantContext.Provider>
  );
}

export { ParticipantProvider };
