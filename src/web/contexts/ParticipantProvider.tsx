import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ParticipantStatus } from '../../api/entities/Participant';
import { Loading } from '../components/Core/Loading';
import { GetParticipantByUserId, ParticipantResponse } from '../services/participant';
import { CurrentUserContext } from './CurrentUserProvider';

type PariticipantWithSetter = {
  participant: ParticipantResponse | null;
};
export const ParticipantContext = createContext<PariticipantWithSetter>({
  participant: null,
});

function ParticipantProvider({ children }: { children: ReactNode }) {
  const [participant, setParticipant] = useState<ParticipantResponse | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const { LoggedInUser } = useContext(CurrentUserContext);
  const location = useLocation();
  const navigate = useNavigate();
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
      if (user) {
        const p = (await GetParticipantByUserId(user!.id)) as ParticipantResponse;
        setParticipant(p);
      }
      setIsLoading(false);
    };
    if (!participant) loadParticipant();
  }, [user, participant]);

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
