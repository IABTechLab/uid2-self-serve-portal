import { useState } from 'react';

import { Dialog } from '../components/Core/Dialog';
import { ParticipantSearchBar } from '../components/SharingPermission/ParticipantSearchBar';

import './searchAndAddParticipantsDialog.scss';

type SearchAndAddParticipantsProps = {
  onSharingPermissionsAdded: () => void;
};
export function SearchAndAddParticipants({
  onSharingPermissionsAdded,
}: SearchAndAddParticipantsProps) {
  const [open, setOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

  const onHandleAddParticipants = () => {
    setOpenConfirmation(false);
    setOpen(false);
    onSharingPermissionsAdded();
  };

  return (
    <Dialog
      triggerButton={
        <button type='button' className='primary-button add-sharing-permission-button'>
          Add Sharing Permission
        </button>
      }
      open={open}
      onOpenChange={setOpen}
      fullScreen
    >
      <div className='add-participant-dialog-content'>
        <div className='add-participant-dialog-search-bar'>
          <ParticipantSearchBar
            participants={[]}
            defaultSelected={[]}
            onSelectedChange={setSelectedParticipants}
          />
          {/* TODO: Add Automatically Add Participant Types: */}
        </div>
        <div className='action-section'>
          {selectedParticipants && (
            <span>
              <b>{selectedParticipants.length} Participant Selected</b>
            </span>
          )}
          <Dialog
            title='Please review the following changes'
            triggerButton={
              <button type='button' className='primary-button add-participant-button'>
                Add Participants
              </button>
            }
            open={openConfirmation}
            onOpenChange={setOpenConfirmation}
          >
            <ul className='dot-list'>
              <li>Adding 1 Participant</li>
              <li>adding future publishers who join Unified ID to decrypt your UID2 tokens.</li>
            </ul>
            <div className='action-section'>
              <button type='button' className='primary-button' onClick={onHandleAddParticipants}>
                I acknowledge these changes
              </button>
            </div>
          </Dialog>
        </div>
      </div>
    </Dialog>
  );
}
