import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ParticipantDTO, ParticipantStatus } from '../../api/entities/Participant';
import { Loading } from '../components/Core/Loading/Loading';
import { GetSelectedParticipant, GetUsersDefaultParticipant } from '../services/participant';
import { ApiError } from '../utils/apiError';
import { useAsyncThrowError } from '../utils/errorHandler';
import { parseParticipantId } from '../utils/urlHelpers';
import { CurrentUserContext } from './CurrentUserProvider';

type ParticipantWithSetter = {
  participant: ParticipantDTO | null;
  setParticipant: (participant: ParticipantDTO) => void;
};
export const ParticipantContext = createContext<ParticipantWithSetter>({
  participant: null,
  setParticipant: () => {},
});

function ParticipantProvider({ children }: { children: ReactNode }) {
  const [participant, setParticipant] = useState<ParticipantDTO | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const { LoggedInUser } = useContext(CurrentUserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const throwError = useAsyncThrowError();
  const user = LoggedInUser?.user || null;
  const { participantId } = useParams();
  const parsedParticipantId = parseParticipantId(participantId);

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
      setIsLoading(true);
      try {
        if (user) {
          const p = parsedParticipantId
            ? await GetSelectedParticipant(parsedParticipantId)
            : await GetUsersDefaultParticipant();
          setParticipant(p);
        }
      } catch (e: unknown) {
        if (e instanceof ApiError) throwError(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (!participant) loadParticipant();
  }, [user, participant, throwError, parsedParticipantId]);

  const participantContext = useMemo(
    () => ({
      participant,
      setParticipant,
    }),
    [participant]
  );
  return (
    <ParticipantContext.Provider value={participantContext}>
      {loading ? <Loading /> : children}
    </ParticipantContext.Provider>
  );
}

export { ParticipantProvider };
