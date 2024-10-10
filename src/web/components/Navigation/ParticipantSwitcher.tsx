import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { CurrentUserContext } from '../../contexts/CurrentUserProvider';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { getPathWithParticipant } from '../../utils/urlHelpers';
import { SelectDropdown, SelectOption } from '../Input/SelectDropdown';

import './ParticipantSwitcher.scss';

export function ParticipantSwitcher() {
  const { participant } = useContext(ParticipantContext);
  console.log(participant);
  const { LoggedInUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [participantOption, setParticipantOption] = useState<SelectOption<number>>();

  const participantOptions: SelectOption<number>[] =
    LoggedInUser?.user?.participants?.map((value) => ({
      id: value.id,
      name: value.name,
    })) ?? [];

  const currentParticipantOption = participantOptions.find(
    (option) => option.id === participant?.id
  );
  console.log('cpo: ', currentParticipantOption);

  const handleOnSelectedChange = (selectedParticipantId: SelectOption<number>) => {
    const newPath = getPathWithParticipant(location.pathname, selectedParticipantId.id);
    navigate(newPath);
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
