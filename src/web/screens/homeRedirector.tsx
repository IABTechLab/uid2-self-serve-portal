import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { UserIdsParticipantIds } from '../contexts/ParticipantProvider';
import { GetSelectedParticipant, GetUsersDefaultParticipant } from '../services/participant';

export function HomeRedirector() {
  const navigate = useNavigate();
  const { participantId } = useParams();
  const { LoggedInUser } = useContext(CurrentUserContext);
  const userId = LoggedInUser?.user?.id ?? null;
  const lastSelectedParticipantIds: UserIdsParticipantIds = (JSON.parse(
    localStorage.getItem('lastSelectedParticipantIds') ?? '{}'
  ) ?? {}) as UserIdsParticipantIds;

  useEffect(() => {
    const loadParticipant = async () => {
      let lastSelectedParticipantId;
      if (userId) {
        lastSelectedParticipantId = lastSelectedParticipantIds[userId];
      }

      const currentParticipant = lastSelectedParticipantId
        ? await GetSelectedParticipant(lastSelectedParticipantId)
        : await GetUsersDefaultParticipant();

      navigate(`/participant/${currentParticipant.id}/home`);
    };
    if (!participantId) {
      loadParticipant();
    }
  }, [navigate, participantId, userId, lastSelectedParticipantIds]);

  return null;
}
