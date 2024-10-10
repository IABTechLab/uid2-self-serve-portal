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

  // const lastSelectedParticipantId = localStorage.getItem('lastSelectedParticipantId');
  // const currentParticipantOptionId = lastSelectedParticipantId
  //   ? parseInt(lastSelectedParticipantId, 10)
  //   : participant?.id;
  // const currentParticipantOption = participantOptions.find(
  //   (option) => option.id === currentParticipantOptionId
  // );

  const currentParticipantOption = participantOptions.find(
    (option) => option.id === participant?.id
  );

  const handleOnSelectedChange = (selectedParticipantId: SelectOption<number>) => {
    const newPath = getPathWithParticipant(location.pathname, selectedParticipantId.id);
    navigate(newPath);
    // const selectedParticipant = LoggedInUser?.user?.participants?.find(
    //   (p) => p.id === selectedParticipantId.id
    // );
    // if (selectedParticipant) {
    //   setParticipant(selectedParticipant);
    //   localStorage.setItem('lastSelectedParticipantId', selectedParticipant.id.toString());
    // }
  };

  const showDropdown = (LoggedInUser?.user?.participants?.length ?? 0) > 1;

  return (
    <div className='participant-switcher'>
      {showDropdown ? (
        <SelectDropdown
          initialValue={currentParticipantOption}
          options={participantOptions}
          onSelectedChange={handleOnSelectedChange}
        />
      ) : (
        participant && <div className='participant-name'>{participant.name}</div>
      )}
    </div>
  );
}
