import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ParticipantStatus } from '../../api/entities/Participant';
import { Loading } from '../components/Core/Loading';
import { GetParticipantByUserId, ParticipantPayload } from '../services/participant';
import { ApiError } from '../utils/apiError';
import { useAsyncError } from '../utils/errorHandler';
import { CurrentUserContext } from './CurrentUserProvider';

type PariticipantWithSetter = {
  participant: ParticipantPayload | null;
};
export const ParticipantContext = createContext<PariticipantWithSetter>({
  participant: null,
});

function ParticipantProvider({ children }: { children: ReactNode }) {
  const [participant, setParticipant] = useState<ParticipantPayload | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const { LoggedInUser } = useContext(CurrentUserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const throwError = useAsyncError();
  const user = LoggedInUser?.user || null;

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
          const p = await GetParticipantByUserId(user!.id);
          setParticipant(p);
        }
      } catch (e: unknown) {
        if (e instanceof ApiError) throwError(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (!participant) loadParticipant();
  }, [user, participant, throwError]);

  const participantContext = useMemo(
    () => ({
      participant,
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
