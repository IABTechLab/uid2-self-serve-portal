import { z } from 'zod';

import { ParticipantTypeSchema } from '../../../api/entities/ParticipantType';
import { ParticipantPayload } from '../../services/participant';
import { SelectAllCheckbox } from '../Core/SelectAllCheckbox';

import './ParticipantItem.scss';

type ParticipantItemProps = {
  participant: ParticipantPayload;
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
    <tr onClick={onClick}>
      <td>
        <SelectAllCheckbox
          onSelectAll={onClick}
          onUnselect={onClick}
          status={checked}
          className='participant-checkbox'
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
