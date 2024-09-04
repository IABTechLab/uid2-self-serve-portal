import { useContext } from 'react';

import { ErrorView } from '../components/Core/ErrorView/ErrorView';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';

export function useParticipantCheck() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const userHasNoParticipants = LoggedInUser?.user?.participants?.length === 0;

  if (userHasNoParticipants) {
    return <ErrorView message='You do not have access to any participants.' />;
  }

  return null;
}
