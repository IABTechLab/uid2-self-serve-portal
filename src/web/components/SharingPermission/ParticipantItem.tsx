import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { SharingSiteDTO, SharingSiteWithSource } from '../../../api/helpers/siteConvertingHelpers';
import { AdminSiteDTO, ClientTypeDescriptions } from '../../../api/services/adminServiceHelpers';
import ActionButton from '../Core/ActionButton';
import { Tooltip } from '../Core/Tooltip';
import { TriStateCheckbox } from '../Core/TriStateCheckbox';
import { DeletePermissionDialog } from './DeletePermissionDialog';
import {
  formatSourceColumn,
  isAddedByManual,
  isSharingParticipant,
} from './ParticipantTableHelper';

import './ParticipantItem.scss';

function getParticipantTypes(siteTypes?: AdminSiteDTO['clientTypes']) {
  if (!siteTypes) return null;
  return siteTypes.map((pt) => (
    <div className='participant-type-label' key={pt}>
      {ClientTypeDescriptions[pt]}
    </div>
  ));
}

type ParticipantItemSimpleProps = Readonly<{
  site: SharingSiteDTO | SharingSiteWithSource;
}>;

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
  onDelete?: (siteIdsToDelete: number[]) => void;
  sharingSites?: SharingSiteWithSource[];
};

export function ParticipantItem({
  site,
  onClick,
  checked,
  onDelete,
  sharingSites,
}: ParticipantItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const checkboxDisabled = isSharingParticipant(site) && !isAddedByManual(site);
  const checkbox = (
    <TriStateCheckbox onClick={onClick} status={checked} disabled={checkboxDisabled} />
  );

  console.log('sharingsites:', sharingSites);

  const onDeleteDialogChange = () => {
    setShowDeleteDialog(!showDeleteDialog);
  };
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
      {onDelete && <ActionButton onClick={() => setShowDeleteDialog(true)} icon='trash-can' />}
      {showDeleteDialog && onDelete && sharingSites && (
        <DeletePermissionDialog
          onDeleteSharingPermission={onDelete}
          onOpenChange={onDeleteDialogChange}
          selectedSiteList={sharingSites.filter((p) => site.id === p.id)}
        />
      )}
    </tr>
  );
}
