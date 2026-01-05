import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  loadParticipant: () => Promise<void>;
};

export type UserIdParticipantId = {
  [key: string]: number;
};

export const ParticipantContext = createContext<ParticipantWithSetter>({
  participant: null,
  setParticipant: () => {},
  loadParticipant: async () => {},
});

function ParticipantProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [participant, setParticipant] = useState<ParticipantDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { LoggedInUser } = useContext(CurrentUserContext);

  const throwError = useAsyncThrowError();
  const user = LoggedInUser?.user ?? null;
  const { participantId } = useParams();

  const parsedParticipantId = parseParticipantId(participantId);

  const loadParticipant = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        const lastSelectedParticipantIds = (JSON.parse(
          localStorage.getItem('lastSelectedParticipantIds') ?? '{}'
        ) ?? {}) as UserIdParticipantId;

        let currentParticipantId: number | undefined =
          parsedParticipantId ?? lastSelectedParticipantIds[user.id];

        // validate user has access to the requested participant, clear local storage if not
        if (
          currentParticipantId &&
          !user.participants?.some((p) => p.id === currentParticipantId)
        ) {
          delete lastSelectedParticipantIds[user.id];
          localStorage.setItem(
            'lastSelectedParticipantIds',
            JSON.stringify(lastSelectedParticipantIds)
          );
          currentParticipantId = undefined;
        }

        const currentParticipant = currentParticipantId
          ? await GetSelectedParticipant(currentParticipantId)
          : await GetUsersDefaultParticipant();

        setParticipant(currentParticipant);
        if (currentParticipant) {
          lastSelectedParticipantIds[user.id] = currentParticipant.id;
          localStorage.setItem(
            'lastSelectedParticipantIds',
            JSON.stringify(lastSelectedParticipantIds)
          );
        }
      }
    } catch (e: unknown) {
      // If participant loading fails, try to fall back to default participant
      try {
        if (user) {
          const lastSelectedParticipantIds = (JSON.parse(
            localStorage.getItem('lastSelectedParticipantIds') ?? '{}'
          ) ?? {}) as UserIdParticipantId;
          delete lastSelectedParticipantIds[user.id];
          localStorage.setItem(
            'lastSelectedParticipantIds',
            JSON.stringify(lastSelectedParticipantIds)
          );

          const defaultParticipant = await GetUsersDefaultParticipant();
          if (defaultParticipant) {
            setParticipant(defaultParticipant);
            lastSelectedParticipantIds[user.id] = defaultParticipant.id;
            localStorage.setItem(
              'lastSelectedParticipantIds',
              JSON.stringify(lastSelectedParticipantIds)
            );
          } else {
            setParticipant(null);
          }
        }
      } catch (fallbackError) {
        if (e instanceof ApiError) throwError(e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, parsedParticipantId, throwError]);

  useEffect(() => {
    if (!participant || (parsedParticipantId && parsedParticipantId !== participant?.id)) {
      loadParticipant();
    }
  }, [participant, parsedParticipantId, loadParticipant]);

  const participantContext = useMemo(
    () => ({
      participant,
      setParticipant,
      loadParticipant,
    }),
    [participant, loadParticipant]
  );
  return (
    <ParticipantContext.Provider value={participantContext}>
      {isLoading ? <Loading /> : children}
    </ParticipantContext.Provider>
  );
}

export { ParticipantProvider };
