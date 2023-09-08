import { z } from 'zod';

import { ParticipantTypeSchema } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { TriStateCheckbox } from '../Core/TriStateCheckbox';
import {
  formatSourceColumn,
  isAddedByManual,
  isSharingParticipant,
  SharingParticipant,
} from './ParticipantTableHelper';

import './ParticipantItem.scss';

function getParticipantTypes(participantTypes?: z.infer<typeof ParticipantTypeSchema>[]) {
  if (!participantTypes) return null;
  return participantTypes.map((pt) => (
    <div className='participant-type-label' key={pt.typeName}>
      {pt.typeName}
    </div>
  ));
}

type ParticipantItemSimpleProps = {
  participant: AvailableParticipantDTO | SharingParticipant;
};

export function ParticipantItemSimple({ participant }: ParticipantItemSimpleProps) {
  const logo = '/default-logo.svg';

  return (
    <>
      <td className='participant-name-cell'>
        <img src={logo} alt={participant.name} className='participant-logo' />
        <label htmlFor={`checkbox-${participant.siteId}`} className='checkbox-label'>
          {participant.name}
        </label>
      </td>
      <td>
        <div className='participant-types'>{getParticipantTypes(participant.types)}</div>
      </td>
    </>
  );
}

type ParticipantItemProps = ParticipantItemSimpleProps & {
  onClick: () => void;
  checked: boolean;
};

export function ParticipantItem({ participant, onClick, checked }: ParticipantItemProps) {
  return (
    <tr className='participant-item-with-checkbox'>
      <td>
        <TriStateCheckbox
          onClick={onClick}
          status={checked}
          className='participant-checkbox'
          disabled={isSharingParticipant(participant) && !isAddedByManual(participant)}
        />
      </td>
      <ParticipantItemSimple participant={participant} />
      {isSharingParticipant(participant) && <td>{formatSourceColumn(participant.addedBy)}</td>}
    </tr>
  );
}
