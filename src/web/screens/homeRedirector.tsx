import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { GetSelectedParticipant, GetUsersDefaultParticipant } from '../services/participant';
import { parseParticipantId } from '../utils/urlHelpers';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';

export function HomeRedirector() {
  const navigate = useNavigate();
  const { participantId } = useParams();
  const { LoggedInUser } = useContext(CurrentUserContext);

  useEffect(() => {
    const loadParticipant = async () => {
      const lastSelectedParticipantIds =
        JSON.parse(localStorage.getItem('lastSelectedParticipantIds') ?? '{}') ?? {};

      let lastSelectedParticipantId;
      if (LoggedInUser?.user) {
        lastSelectedParticipantId = parseParticipantId(
          lastSelectedParticipantIds[LoggedInUser.user.id]
        );
      }

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
