import { Suspense, useContext, useMemo, useState } from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { ParticipantType } from '../../../api/entities/ParticipantType';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { ParticipantResponse } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { Loading } from '../Core/Loading';
import { ParticipantSearchBar } from './ParticipantSearchBar';

import './searchAndAddParticipantsDialog.scss';

type SearchAndAddParticipantsProps = {
  onSharingPermissionsAdded: (selectedSiteIds: number[]) => void;
  defaultSelected: ParticipantResponse[];
};
export function SearchAndAddParticipants({
  onSharingPermissionsAdded,
  defaultSelected,
}: SearchAndAddParticipantsProps) {
  const [open, setOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const { participants, participantTypes } = useLoaderData() as {
    participants: ParticipantResponse[];
    participantTypes: ParticipantType[];
  };
  const { participant } = useContext(ParticipantContext);

  const onHandleAddParticipants = () => {
    setOpenConfirmation(false);
    setOpen(false);
    onSharingPermissionsAdded(selectedParticipants);
  };

  const defaultSelectedParticipants = useMemo(() => {
    return defaultSelected.map((p) => p.siteId!);
  }, [defaultSelected]);

  const getParticipantText = (participantCount: number): string => {
    if (participantCount === 1) {
      return '1 participant';
    }
    return `${participantCount} participants`;
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
              {(resolvedParticipants: ParticipantResponse[]) => (
                <ParticipantSearchBar
                  participants={resolvedParticipants.filter((p) => p.id !== participant?.id)}
                  defaultSelected={defaultSelectedParticipants}
                  onSelectedChange={setSelectedParticipants}
                  participantTypes={participantTypes}
                />
              )}
            </Await>
          </Suspense>
          {/* TODO: Add Automatically Add Participant Types: */}
        </div>
        <div className='action-section'>
          {selectedParticipants && (
            <span>
              <b> {getParticipantText(selectedParticipants.length)} Selected</b>
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
              <li>Adding {getParticipantText(selectedParticipants.length)}</li>
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
