import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ParticipantStatus } from '../../api/entities/Participant';
import { GetUsersDefaultParticipant } from '../services/participant';

export function HomeRedirector() {
  const navigate = useNavigate();
  const { participantId } = useParams();

  useEffect(() => {
    const loadParticipant = async () => {
      const currentParticipant = await GetUsersDefaultParticipant();
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
