import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { UserIdParticipantId } from '../contexts/ParticipantProvider';
import { GetSelectedParticipant, GetUsersDefaultParticipant } from '../services/participant';

export function HomeRedirector() {
  const navigate = useNavigate();
  const { participantId } = useParams();
  const { LoggedInUser } = useContext(CurrentUserContext);
  const user = LoggedInUser?.user ?? null;

  useEffect(() => {
    const loadParticipant = async () => {
      const lastSelectedParticipantIds = (JSON.parse(
        localStorage.getItem('lastSelectedParticipantIds') ?? '{}'
      ) ?? {}) as UserIdParticipantId;
      const lastSelectedParticipantId = user ? lastSelectedParticipantIds[user.id] : undefined;

      let currentParticipant;

      // Try to validate access to localStorage participant first
      if (lastSelectedParticipantId && user) {
        try {
          // Check if user still has access to this participant
          const userHasAccess = user.participants?.some(p => p.id === lastSelectedParticipantId);
          if (userHasAccess) {
            currentParticipant = await GetSelectedParticipant(lastSelectedParticipantId);
          } else {
            // Clear invalid localStorage entry
            delete lastSelectedParticipantIds[user.id];
            localStorage.setItem('lastSelectedParticipantIds', JSON.stringify(lastSelectedParticipantIds));
          }
        } catch (error) {
          // If GetSelectedParticipant fails, clear the invalid entry and fall back
          delete lastSelectedParticipantIds[user.id];
          localStorage.setItem('lastSelectedParticipantIds', JSON.stringify(lastSelectedParticipantIds));
        }
      }

      // Fall back to default participant if no valid cached participant
      if (!currentParticipant) {
        currentParticipant = await GetUsersDefaultParticipant();
      }

      navigate(`/participant/${currentParticipant.id}/home`);
    };
    if (!participantId) {
      loadParticipant();
    }
  }, [navigate, participantId, user]);

  return null;
}
