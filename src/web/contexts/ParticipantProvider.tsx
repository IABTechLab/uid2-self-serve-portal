import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ParticipantStatus } from '../../api/entities/Participant';
import { GetParticipantByUserId, ParticipantPayload } from '../services/participant';
import { CurrentUserContext } from './CurrentUserProvider';

type PariticipantWithSetter = {
  participant: ParticipantPayload | null;
};
export const ParticipantContext = createContext<PariticipantWithSetter>({
  participant: null,
});

function ParticipantProvider({ children }: { children: ReactNode }) {
  const [participant, setParticipant] = useState<ParticipantPayload | null>(null);
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
      const p = await GetParticipantByUserId(user!.id);
      setParticipant(p);
    };
    if (user) {
      loadParticipant();
    }
  }, [user]);

  const participantContext = useMemo(
    () => ({
      participant,
    }),
    [participant]
  );
  return (
    <ParticipantContext.Provider value={participantContext}>{children}</ParticipantContext.Provider>
  );
}

export { ParticipantProvider };
