import { SharingSiteWithSource } from "../../../api/helpers/siteConvertingHelpers";
import { ClientType ,
  ClientTypeDescriptions,
} from "../../../api/services/adminServiceHelpers";
import { formatStringsWithSeparator } from "../../utils/textHelpers";
import { Dialog } from "../Core/Dialog";
import {
  MANUALLY_ADDED,
} from './ParticipantTableHelper';

type DeletePermissionDialogProps = Readonly<{
  onDeleteSharingPermission: () => void;
  selectedSiteList: SharingSiteWithSource[];
  onOpenChange: () => void;
}>;
export function DeletePermissionDialog({
  onDeleteSharingPermission,
  selectedSiteList,
  onOpenChange
}: DeletePermissionDialogProps) {
  const handleDeletePermissions = () => {
    onDeleteSharingPermission();
    onOpenChange();
  };

  const showDeletionNotice = (participant: SharingSiteWithSource) => {
    const remainSources = participant.addedBy.filter(
      (source) => source !== MANUALLY_ADDED
    ) as ClientType[];
    const remainSourceDescriptions = remainSources.map((x) => ClientTypeDescriptions[x]);
    if (remainSourceDescriptions.length) {
      return (
        <span>
          {' '}
          (This site will remain shared by {formatStringsWithSeparator(remainSourceDescriptions)})
        </span>
      );
    }
  };

  return (

        <Dialog
          title='Are you sure you want to delete these permissions?'
          onOpenChange={onOpenChange}
          closeButtonText='Cancel'
        >
          <div className='dialog-body-section'>
            <ul className='dot-list'>
              {selectedSiteList.map((participant) => (
                <li key={participant.id}>
                  {participant.name}
                  {showDeletionNotice(participant)}
                </li>
              ))}
            </ul>
          </div>
          <div className='dialog-footer-section'>
            <button type='button' className='primary-button' onClick={handleDeletePermissions}>
              Delete Permissions
            </button>
          </div>
        </Dialog>

  );
}
