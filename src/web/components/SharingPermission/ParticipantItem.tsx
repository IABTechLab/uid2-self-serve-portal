import { ReactNode, useState } from 'react';

import { SharingSiteDTO, SharingSiteWithSource } from '../../../api/helpers/siteConvertingHelpers';
import { AdminSiteDTO, ClientTypeDescriptions } from '../../../api/services/adminServiceHelpers';
import ActionButton from '../Core/Buttons/ActionButton';
import { LabelRow } from '../Core/Labels/LabelRow';
import { Tooltip } from '../Core/Tooltip/Tooltip';
import { TriStateCheckbox } from '../Input/TriStateCheckbox';
import { DeletePermissionDialog } from './DeletePermissionDialog';
import {
  formatSourceColumn,
  isAddedByManual,
  isSharingParticipant,
} from './ParticipantTableHelper';

import './ParticipantItem.scss';

function getParticipantTypes(siteTypes?: AdminSiteDTO['clientTypes']) {
  if (!siteTypes) return null;
  const labelNames = siteTypes.map((pt) => ClientTypeDescriptions[pt]);
  return <LabelRow labelNames={labelNames} />;
}

type ParticipantItemSimpleProps = Readonly<{
  site: SharingSiteDTO | SharingSiteWithSource;
}>;

export function ParticipantItemSimple({ site }: ParticipantItemSimpleProps) {
  return (
    <>
      <td className='participant-name-cell'>
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

  const actionButtonDeletePermissions = (
    <ActionButton
      onClick={() => setShowDeleteDialog(true)}
      icon='trash-can'
      disabled={checkboxDisabled}
    />
  );

  const tooltipNoDelete = (trigger: ReactNode) => {
    return (
      <Tooltip trigger={trigger}>
        Gray indicates participants selected in bulk permissions. To update, adjust bulk permission
        settings.
      </Tooltip>
    );
  };

  const onDeleteDialogChange = () => {
    setShowDeleteDialog(!showDeleteDialog);
  };
  return (
    <tr className='participant-item-with-checkbox'>
      <td>{checkboxDisabled ? tooltipNoDelete(checkbox) : checkbox}</td>
      <ParticipantItemSimple site={site} />
      {isSharingParticipant(site) && <td>{formatSourceColumn(site.addedBy)}</td>}
      {onDelete && (
        <td className='action-cell'>
          {checkboxDisabled
            ? tooltipNoDelete(actionButtonDeletePermissions)
            : actionButtonDeletePermissions}
        </td>
      )}
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
