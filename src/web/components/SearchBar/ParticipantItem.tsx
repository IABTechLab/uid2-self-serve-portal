import { ParticipantPayload } from '../../services/participant';

import './ParticipantItem.scss';

type ParticipantItemProps = {
  participant: ParticipantPayload;
  onClick: () => void;
  checked: boolean;
};

export function ParticipantItem({ participant, onClick, checked }: ParticipantItemProps) {
  function getParticipantTypes(participantTypes?: { id: number; typeName: string }[]) {
    if (!participantTypes) return null;
    return participantTypes.map((pt) => (
      <div className='participant-type-label' key={pt.typeName}>
        {pt.typeName}
      </div>
    ));
  }

  // TODO: update this when we have login uploading
  const logo = '/default-logo.png';
  return (
    <div className='participant-item'>
      <input
        type='checkbox'
        checked={checked}
        onChange={onClick}
        id={`checkbox-${participant.id}`}
        className='participant-checkbox'
      />
      <img src={logo} alt={participant.name} className='participant-logo' />
      <label htmlFor={`checkbox-${participant.id}`} className='checkbox-label'>
        {participant.name}
      </label>
      <div className='participant-types'>{getParticipantTypes(participant.types)}</div>
    </div>
  );
}
