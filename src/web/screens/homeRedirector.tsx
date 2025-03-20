import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { GetSelectedParticipant, GetUsersDefaultParticipant } from '../services/participant';
import { parseParticipantId } from '../utils/urlHelpers';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { UserIdParticipantIdPair } from '../contexts/ParticipantProvider';

export function HomeRedirector() {
  const navigate = useNavigate();
  const { participantId } = useParams();
  const { LoggedInUser } = useContext(CurrentUserContext);

  useEffect(() => {
    const loadParticipant = async () => {
      const lastSelectedParticipantIds: UserIdParticipantIdPair[] =
        JSON.parse(localStorage.getItem('lastSelectedParticipantIds') ?? '[]') ?? [];
      const pid = lastSelectedParticipantIds.find(
        (id) => LoggedInUser?.user?.id === parseInt(id.userId, 10)
      )?.participantId;
      const lastSelectedParticipantId = parseParticipantId(pid);
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
