import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { UserIdParticipantId } from '../contexts/ParticipantProvider';
import { GetSelectedParticipant, GetUsersDefaultParticipant } from '../services/participant';

export function HomeRedirector() {
  const navigate = useNavigate();
  const { participantId } = useParams();
  const { LoggedInUser } = useContext(CurrentUserContext);

  useEffect(() => {
    const loadParticipant = async () => {
      const userId = LoggedInUser?.user?.id ?? null;

      const lastSelectedParticipantIds = (JSON.parse(
        localStorage.getItem('lastSelectedParticipantIds') ?? '{}'
      ) ?? {}) as UserIdParticipantId;
      const lastSelectedParticipantId = userId ? lastSelectedParticipantIds[userId] : undefined;

      const currentParticipant = lastSelectedParticipantId
        ? await GetSelectedParticipant(lastSelectedParticipantId)
        : await GetUsersDefaultParticipant();

      navigate(`/participant/${currentParticipant.id}/home`);
    };
    if (!participantId) {
      loadParticipant();
    }
  }, [navigate, participantId]);

  return null;
}
