import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ParticipantDTO, ParticipantStatus } from '../../api/entities/Participant';
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
export const ParticipantContext = createContext<ParticipantWithSetter>({
  participant: null,
  setParticipant: () => {},
});

function ParticipantProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [participant, setParticipant] = useState<ParticipantDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { LoggedInUser } = useContext(CurrentUserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const throwError = useAsyncThrowError();
  const user = LoggedInUser?.user ?? null;
  const { participantId } = useParams();
  const parsedParticipantId = parseParticipantId(participantId);
  const lastSelectedParticipant = localStorage.getItem('lastSelectedParticipantId');
  const parsedLastSelectedParticipant = parseInt(lastSelectedParticipant ?? '', 10);

  const myParticipantId = parsedParticipantId ?? parsedLastSelectedParticipant;

  useEffect(() => {
    if (
      participant &&
      participant.status !== ParticipantStatus.Approved &&
      location.pathname !== '/account/pending'
    ) {
      navigate('/account/pending');
    }
  }, [location.pathname, navigate, participant]);

  useEffect(() => {
    const loadParticipant = async () => {
      try {
        if (user) {
          const p = myParticipantId
            ? await GetSelectedParticipant(myParticipantId)
            : await GetUsersDefaultParticipant();
          setParticipant(p);
          localStorage.setItem('lastSelectedParticipantId', p.id.toString());
        }
      } catch (e: unknown) {
        if (e instanceof ApiError) throwError(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (!participant || myParticipantId !== participant?.id) loadParticipant();
  }, [user, participant, throwError, myParticipantId]);

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
