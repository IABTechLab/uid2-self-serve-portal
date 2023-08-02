import { useContext, useMemo, useState } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/participantsRouter';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { Dialog } from '../Core/Dialog';
import { ParticipantSearchBar } from './ParticipantSearchBar';

import './SearchAndAddParticipants.scss';

type SearchAndAddParticipantsProps = {
  onSharingPermissionsAdded: (selectedSiteIds: number[]) => Promise<void>;
  sharingParticipants: AvailableParticipantDTO[];
  availableParticipants: AvailableParticipantDTO[];
  participantTypes: ParticipantTypeDTO[];
};
export function SearchAndAddParticipants({
  onSharingPermissionsAdded,
  sharingParticipants,
  availableParticipants,
  participantTypes,
}: SearchAndAddParticipantsProps) {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set());
  const [openSearchResult, setOpenSearchResult] = useState<boolean>(false);
  const { participant } = useContext(ParticipantContext);
  const onHandleAddParticipants = () => {
    setOpenConfirmation(false);
    setSelectedParticipants(new Set());
    onSharingPermissionsAdded(Array.from(selectedParticipants));
  };

  const sharingParticipantsSiteIds = useMemo(() => {
    return new Set(sharingParticipants.map((p) => p.siteId));
  }, [sharingParticipants]);

  const selectedParticipantList = useMemo(() => {
    return availableParticipants.filter((p) => selectedParticipants.has(p.siteId!));
  }, [availableParticipants, selectedParticipants]);

  const getSearchableParticipants = (resolvedParticipants: AvailableParticipantDTO[]) => {
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

  const handleSelectedParticipantChanged = (selectedItems: Set<number>) => {
    setSelectedParticipants(selectedItems);
    setOpenSearchResult(false);
  };

  return (
    <div className='search-and-add-participants'>
      <div className='add-participant-dialog-search-bar'>
        <ParticipantSearchBar
          selectedParticipantIds={selectedParticipants}
          participants={getSearchableParticipants(availableParticipants)}
          onSelectedChange={handleSelectedParticipantChanged}
          participantTypes={participantTypes}
          open={openSearchResult}
          onToggleOpen={setOpenSearchResult}
        />
      </div>
      {!openSearchResult && (
        <div className='action-section'>
          {selectedParticipants.size > 0 && (
            <p>{getParticipantText(selectedParticipants.size)} added</p>
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
            Adding the following participants:
            <ul className='dot-list'>
              {selectedParticipantList.map((selectedParticipant) => (
                <li key={selectedParticipant.id}>{selectedParticipant.name}</li>
              ))}
            </ul>
            <div className='dialog-footer-section'>
              <button type='button' className='primary-button' onClick={onHandleAddParticipants}>
                Save
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
      )}
    </div>
  );
}
