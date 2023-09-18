import { useContext, useMemo, useState } from 'react';

import { SharingSiteDTO } from '../../../api/helpers/siteConvertingHelpers';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { useAvailableSiteList } from '../../services/site';
import { Dialog } from '../Core/Dialog';
import { Loading } from '../Core/Loading';
import { ParticipantSearchBar } from './ParticipantSearchBar';

import './SearchAndAddParticipants.scss';

type SearchAndAddParticipantsProps = {
  onSharingPermissionsAdded: (selectedSiteIds: number[]) => Promise<void>;
  sharedSiteIds: number[];
};
export function SearchAndAddParticipants({
  onSharingPermissionsAdded,
  sharedSiteIds,
}: SearchAndAddParticipantsProps) {
  const { sites, isLoading } = useAvailableSiteList();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedSites, setSelectedSites] = useState<Set<number>>(new Set());
  const [openSearchResult, setOpenSearchResult] = useState<boolean>(false);
  const { participant } = useContext(ParticipantContext);
  const onHandleAddSites = () => {
    setOpenConfirmation(false);
    setSelectedSites(new Set());
    onSharingPermissionsAdded(Array.from(selectedSites));
  };

  const sharingSiteIds = useMemo(() => {
    return new Set(sharedSiteIds);
  }, [sharedSiteIds]);

  const selectedSiteList = useMemo(() => {
    return (sites ?? []).filter((site) => selectedSites.has(site.id!));
  }, [sites, selectedSites]);

  const getSearchableSites = (resolvedSites: SharingSiteDTO[]) => {
    return resolvedSites.filter(
      (site) => site.id !== participant?.siteId && !sharingSiteIds.has(site.id)
    );
  };

  const getSitesText = (siteCount: number): string => {
    if (siteCount === 1) {
      return '1 Participant';
    }
    return `${siteCount} Participants`;
  };

  const handleSelectedSitesChanged = (selectedItems: Set<number>) => {
    setSelectedSites(selectedItems);
  };

  if (isLoading) return <Loading />;

  return (
    <div className='search-and-add-participants'>
      <div className='add-participant-dialog-search-bar'>
        <ParticipantSearchBar
          selectedParticipantIds={selectedSites}
          sites={getSearchableSites(sites!)}
          onSelectedChange={handleSelectedSitesChanged}
          open={openSearchResult}
          onToggleOpen={setOpenSearchResult}
        />
      </div>
      <div className='action-section'>
        {selectedSites.size > 0 && <p>{getSitesText(selectedSites.size)} selected</p>}
        <Dialog
          title='Please review the following changes'
          triggerButton={
            <button
              type='button'
              className='primary-button add-participant-button'
              disabled={!selectedSites.size}
            >
              Add Permissions
            </button>
          }
          open={openConfirmation}
          onOpenChange={setOpenConfirmation}
        >
          Adding permissions for the following participants:
          <ul className='dot-list'>
            {selectedSiteList.map((selectedParticipant) => (
              <li key={selectedParticipant.id}>{selectedParticipant.name}</li>
            ))}
          </ul>
          <div className='dialog-footer-section'>
            <button type='button' className='primary-button' onClick={onHandleAddSites}>
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
