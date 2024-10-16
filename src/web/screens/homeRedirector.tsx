import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ParticipantStatus } from '../../api/entities/Participant';
import { GetSelectedParticipant, GetUsersDefaultParticipant } from '../services/participant';
import { parseParticipantId } from '../utils/urlHelpers';

export function HomeRedirector() {
  const navigate = useNavigate();
  const { participantId } = useParams();

  useEffect(() => {
    const loadParticipant = async () => {
      const lastSelectedParticipantId = parseParticipantId(
        localStorage.getItem('lastSelectedParticipantId') ?? ''
      );
      const currentParticipant = lastSelectedParticipantId
        ? await GetSelectedParticipant(lastSelectedParticipantId)
        : await GetUsersDefaultParticipant();
      if (currentParticipant.status === ParticipantStatus.Approved) {
        navigate(`/participant/${currentParticipant.id}/home`);
      }
    };
    if (!participantId) {
      loadParticipant();
    }
  }, [navigate, participantId]);

  return null;
}
