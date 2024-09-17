import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { CurrentUserContext } from '../../contexts/CurrentUserProvider';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { getPathWithParticipant } from '../../utils/urlHelpers';
import { SelectDropdown, SelectOption } from '../Input/SelectDropdown';

import './ParticipantSwitcher.scss';

export function ParticipantSwitcher() {
  const { participant, setParticipant } = useContext(ParticipantContext);
  const { LoggedInUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const participantOptions: SelectOption<number>[] =
    LoggedInUser?.user?.participants?.map((value) => ({
      id: value.id,
      name: value.name,
    })) ?? [];
  const sortedParticipantOptions = participantOptions.sort((a, b) => a.name.localeCompare(b.name));
  const currentParticipantOption = sortedParticipantOptions.filter(
    (x) => x.id === participant!.id
  )[0];

  const handleOnSelectedChange = (selectedParticipantId: SelectOption<number>) => {
    const newPath = getPathWithParticipant(location.pathname, selectedParticipantId.id);
    navigate(newPath);
    const selectedParticipant = LoggedInUser?.user?.participants?.find(
      (p) => p.id === selectedParticipantId.id
    );
    if (selectedParticipant) {
      setParticipant(selectedParticipant);
    }
  };

  const showDropdown = (LoggedInUser?.user?.participants?.length ?? 0) > 1;

  return (
    <div className='participant-switcher'>
      {showDropdown ? (
        <SelectDropdown
          initialValue={currentParticipantOption}
          options={sortedParticipantOptions}
          onSelectedChange={handleOnSelectedChange}
        />
      ) : (
        <div className='participant-name'>{participant!.name}</div>
      )}
    </div>
  );
}
