import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loading } from '../components/Core/Loading/Loading';
import { GetCurrentUsersParticipant } from '../services/participant';

export function HomeRedirector() {
  const navigate = useNavigate();

  useEffect(() => {
    const loadParticipant = async () => {
      const currentParticipant = await GetCurrentUsersParticipant();
      navigate(`/participant/${currentParticipant.id}/home`);
    };
    loadParticipant();
  }, [navigate]);

  return <Loading />;
}
