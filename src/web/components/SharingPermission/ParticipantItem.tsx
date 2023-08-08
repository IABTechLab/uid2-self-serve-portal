import { z } from 'zod';

import { ParticipantTypeSchema } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/routes/participantsRouter';
import { TriStateCheckbox } from '../Core/TriStateCheckbox';

import './ParticipantItem.scss';

type ParticipantItemProps = {
  participant: AvailableParticipantDTO;
  onClick: () => void;
  checked: boolean;
  addedBy?: string;
};

export function ParticipantItem({ participant, onClick, checked, addedBy }: ParticipantItemProps) {
  function getParticipantTypes(participantTypes?: z.infer<typeof ParticipantTypeSchema>[]) {
    if (!participantTypes) return null;
    return participantTypes.map((pt) => (
      <div className='participant-type-label' key={pt.typeName}>
        {pt.typeName}
      </div>
    ));
  }

  // TODO: update this when we have login uploading
  const logo = '/default-logo.svg';
  return (
    <tr className='participant-item'>
      <td>
        <TriStateCheckbox
          onClick={onClick}
          status={checked}
          className='participant-checkbox'
          disabled={addedBy === 'Auto'} // addedBy is currently hardcoded to 'Manual'
        />
      </td>
      <td className='participant-name-cell'>
        <img src={logo} alt={participant.name} className='participant-logo' />
        <label htmlFor={`checkbox-${participant.id}`} className='checkbox-label'>
          {participant.name}
        </label>
      </td>
      <td>
        <div className='participant-types'>{getParticipantTypes(participant.types)}</div>
      </td>
      {addedBy && <td>{addedBy}</td>}
    </tr>
  );
}
