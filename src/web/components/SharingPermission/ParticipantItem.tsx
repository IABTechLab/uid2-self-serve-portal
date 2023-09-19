import { SharingSiteDTO, SharingSiteWithSource } from '../../../api/helpers/siteConvertingHelpers';
import { ClientTypeDescriptions, SiteDTO } from '../../../api/services/adminServiceHelpers';
import { TriStateCheckbox } from '../Core/TriStateCheckbox';
import {
  formatSourceColumn,
  isAddedByManual,
  isSharingParticipant,
} from './ParticipantTableHelper';

import './ParticipantItem.scss';

function getParticipantTypes(siteTypes?: SiteDTO['clientTypes']) {
  if (!siteTypes) return null;
  return siteTypes.map((pt) => (
    <div className='participant-type-label' key={pt}>
      {ClientTypeDescriptions[pt]}
    </div>
  ));
}

type ParticipantItemSimpleProps = {
  site: SharingSiteDTO | SharingSiteWithSource;
};

export function ParticipantItemSimple({ site }: ParticipantItemSimpleProps) {
  return (
    <>
      <td className='participant-name-cell'>
        {/* <img src={logo} alt={site.name} className='participant-logo' /> */}
        <label className='checkbox-label'>{site.name}</label>
      </td>
      <td>
        <div className='participant-types'>{getParticipantTypes(site.clientTypes)}</div>
      </td>
    </>
  );
}

type ParticipantItemProps = ParticipantItemSimpleProps & {
  onClick: () => void;
  checked: boolean;
};

export function ParticipantItem({ site, onClick, checked }: ParticipantItemProps) {
  return (
    <tr className='participant-item-with-checkbox'>
      <td>
        <TriStateCheckbox
          onClick={onClick}
          status={checked}
          className='participant-checkbox'
          disabled={isSharingParticipant(site) && !isAddedByManual(site)}
        />
      </td>
      <ParticipantItemSimple site={site} />
      {isSharingParticipant(site) && <td>{formatSourceColumn(site.addedBy)}</td>}
    </tr>
  );
}
