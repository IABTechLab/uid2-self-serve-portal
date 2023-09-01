import { useContext, useMemo, useState } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { useAvailableSiteList } from '../../services/site';
import { Dialog } from '../Core/Dialog';
import { Loading } from '../Core/Loading';
import { ParticipantSearchBar } from './ParticipantSearchBar';

import './SearchAndAddParticipants.scss';

type SearchAndAddParticipantsProps = {
  onSharingPermissionsAdded: (selectedSiteIds: number[]) => Promise<void>;
  sharedSiteIds: number[];
  participantTypes: ParticipantTypeDTO[];
};
export function SearchAndAddParticipants({
  onSharingPermissionsAdded,
  sharedSiteIds,
  participantTypes,
}: SearchAndAddParticipantsProps) {
  const { sites: availableParticipants, isLoading } = useAvailableSiteList();
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
    return new Set(sharedSiteIds);
  }, [sharedSiteIds]);

  const selectedParticipantList = useMemo(() => {
    return (availableParticipants ?? []).filter((p) => selectedParticipants.has(p.siteId!));
  }, [availableParticipants, selectedParticipants]);

  const getSearchableParticipants = (resolvedParticipants: AvailableParticipantDTO[]) => {
    return resolvedParticipants.filter(
      (p) => p.siteId !== participant?.siteId && !sharingParticipantsSiteIds.has(p.siteId)
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
  };

  if (isLoading) return <Loading />;

  return (
    <div className='search-and-add-participants'>
      <div className='add-participant-dialog-search-bar'>
        <ParticipantSearchBar
          selectedParticipantIds={selectedParticipants}
          participants={getSearchableParticipants(availableParticipants!)}
          onSelectedChange={handleSelectedParticipantChanged}
          participantTypes={participantTypes}
          open={openSearchResult}
          onToggleOpen={setOpenSearchResult}
        />
      </div>
      <div className='action-section'>
        {selectedParticipants.size > 0 && (
          <p>{getParticipantText(selectedParticipants.size)} selected</p>
        )}
        <Dialog
          title='Please review the following changes'
          triggerButton={
            <button
              type='button'
              className='primary-button add-participant-button'
              disabled={!selectedParticipants.size}
            >
              Add Permissions
            </button>
          }
          open={openConfirmation}
          onOpenChange={setOpenConfirmation}
        >
          Adding permissions for the following participants:
          <ul className='dot-list'>
            {selectedParticipantList.map((selectedParticipant) => (
              <li key={selectedParticipant.siteId}>{selectedParticipant.name}</li>
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
    </div>
  );
}
