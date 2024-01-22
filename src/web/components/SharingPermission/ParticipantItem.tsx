import { SharingSiteDTO, SharingSiteWithSource } from '../../../api/helpers/siteConvertingHelpers';
import { ClientTypeDescriptions, SiteAdmin } from '../../../api/services/adminServiceHelpers';
import { Tooltip } from '../Core/Tooltip';
import { TriStateCheckbox } from '../Core/TriStateCheckbox';
import {
  formatSourceColumn,
  isAddedByManual,
  isSharingParticipant,
} from './ParticipantTableHelper';

import './ParticipantItem.scss';

function getParticipantTypes(siteTypes?: SiteAdmin['clientTypes']) {
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
  const checkboxDisabled = isSharingParticipant(site) && !isAddedByManual(site);
  const checkbox = (
    <TriStateCheckbox onClick={onClick} status={checked} disabled={checkboxDisabled} />
  );
  return (
    <tr className='participant-item-with-checkbox'>
      <td>
        {checkboxDisabled ? (
          <Tooltip trigger={checkbox}>
            Gray indicates participants selected in bulk permissions. To update, adjust bulk
            permission settings.
          </Tooltip>
        ) : (
          checkbox
        )}
      </td>
      <ParticipantItemSimple site={site} />
      {isSharingParticipant(site) && <td>{formatSourceColumn(site.addedBy)}</td>}
    </tr>
  );
}
