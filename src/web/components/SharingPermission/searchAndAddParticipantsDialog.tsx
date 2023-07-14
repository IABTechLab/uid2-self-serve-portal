import { Suspense, useContext, useMemo, useState } from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { ParticipantType } from '../../../api/entities/ParticipantType';
import { AvailableParticipant } from '../../../api/participantsRouter';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { Dialog } from '../Core/Dialog';
import { Loading } from '../Core/Loading';
import { ParticipantSearchBar } from './ParticipantSearchBar';

import './searchAndAddParticipantsDialog.scss';

type SearchAndAddParticipantsProps = {
  onSharingPermissionsAdded: (selectedSiteIds: number[]) => Promise<void>;
  sharingParticipants: AvailableParticipant[];
};
export function SearchAndAddParticipants({
  onSharingPermissionsAdded,
  sharingParticipants,
}: SearchAndAddParticipantsProps) {
  const [open, setOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set());
  const { participants, participantTypes } = useLoaderData() as {
    participants: AvailableParticipant[];
    participantTypes: ParticipantType[];
  };
  const { participant } = useContext(ParticipantContext);

  const onHandleAddParticipants = () => {
    setOpenConfirmation(false);
    setOpen(false);
    setSelectedParticipants(new Set());
    onSharingPermissionsAdded(Array.from(selectedParticipants));
  };

  const sharingParticipantsSiteIds = useMemo(() => {
    return new Set(sharingParticipants.map((p) => p.siteId));
  }, [sharingParticipants]);

  const getSearchableParticipants = (resolvedParticipants: AvailableParticipant[]) => {
    return resolvedParticipants.filter(
      (p) => p.id !== participant?.id && !sharingParticipantsSiteIds.has(p.siteId)
    );
  };

  const getParticipantText = (participantCount: number): string => {
    if (participantCount === 1) {
      return '1 Participant';
    }
    return `${participantCount} Participants`;
  };

  return (
    <Dialog
      triggerButton={
        <button type='button' className='transparent-button add-sharing-permission-button'>
          Advanced Search
        </button>
      }
      open={open}
      onOpenChange={setOpen}
      fullScreen
    >
      <div className='add-participant-dialog-content'>
        <div className='add-participant-dialog-search-bar'>
          <Suspense fallback={<Loading />}>
            <Await resolve={participants}>
              {(resolvedParticipants: AvailableParticipant[]) => (
                <ParticipantSearchBar
                  selectedParticipantIds={selectedParticipants}
                  participants={getSearchableParticipants(resolvedParticipants)}
                  onSelectedChange={setSelectedParticipants}
                  participantTypes={participantTypes}
                />
              )}
            </Await>
          </Suspense>
          {/* TODO: Add Automatically Add Participant Types: */}
        </div>
        <div className='action-section'>
          {selectedParticipants.size > 0 && (
            <span>
              <b> {getParticipantText(selectedParticipants.size)} Selected</b>
            </span>
          )}
          <Dialog
            title='Please review the following changes'
            triggerButton={
              <button
                type='button'
                className='primary-button add-participant-button'
                disabled={!selectedParticipants.size}
              >
                Add Participants
              </button>
            }
            open={openConfirmation}
            onOpenChange={setOpenConfirmation}
          >
            <ul className='dot-list'>
              <li>Adding {getParticipantText(selectedParticipants.size)}</li>
            </ul>
            <div className='dialog-footer-section'>
              <button type='button' className='primary-button' onClick={onHandleAddParticipants}>
                I acknowledge these changes
              </button>
              <button
                type='button'
                className='transparent-button'
                onClick={() => setOpenConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </Dialog>
        </div>
      </div>
    </Dialog>
  );
}
