import { CheckedState } from '@radix-ui/react-checkbox';

import { SharingSiteDTO, SharingSiteWithSource } from '../../../api/helpers/siteConvertingHelpers';
import { ClientType, ClientTypeDescriptions } from '../../../api/services/adminServiceHelpers';
import { TriStateCheckboxState } from '../Core/TriStateCheckbox';

export const MANUALLY_ADDED = 'Manual';

export const isSharingParticipant = (
  site: SharingSiteDTO | SharingSiteWithSource
): site is SharingSiteWithSource => {
  return 'addedBy' in site;
};

export const isAddedByManual = (site: SharingSiteWithSource) => {
  return site.addedBy.includes(MANUALLY_ADDED);
};

export function filterSites<TSharingSite extends SharingSiteDTO>(
  sites: TSharingSite[],
  filterText: string,
  selectedTypeIds?: Set<ClientType>
): TSharingSite[] {
  let filtered = sites;

  if (selectedTypeIds && selectedTypeIds.size > 0) {
    filtered = filtered.filter((p) => p.clientTypes?.some((t) => selectedTypeIds.has(t)));
  }

  if (filterText) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(filterText.toLowerCase()));
  }

  return filtered;
}

export function isSelectedAll(
  filteredParticipants: SharingSiteDTO[],
  checkedParticipants: Set<number>
) {
  if (!filteredParticipants.length || !checkedParticipants.size) return false;
  return filteredParticipants.every((p) => checkedParticipants.has(p.id));
}

export function getSelectAllState(selectAll: boolean, checkedElement: Set<number>) {
  if (selectAll) {
    return TriStateCheckboxState.checked;
  }
  if (checkedElement.size > 0) {
    return TriStateCheckboxState.indeterminate as CheckedState;
  }
  return TriStateCheckboxState.unchecked;
}

export function formatSourceColumn(sources: SharingSiteWithSource['addedBy']) {
  let sourceField = '';
  const manualIndex = sources.indexOf(MANUALLY_ADDED);
  if (manualIndex !== -1) {
    sourceField = MANUALLY_ADDED;
  }

  const sourcesWithoutManual = sources.filter((s) => s !== MANUALLY_ADDED) as ClientType[];
  if (sourcesWithoutManual.length > 0) {
    if (sourceField) {
      sourceField += ' and ';
    }
    sourceField += `Auto: ${sourcesWithoutManual
      .map((source) => ClientTypeDescriptions[source])
      .join(', ')}`;
  }
  return sourceField;
}
