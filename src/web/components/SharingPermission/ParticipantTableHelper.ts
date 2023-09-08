import { CheckedState } from '@radix-ui/react-checkbox';

import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { TriStateCheckboxState } from '../Core/TriStateCheckbox';

export type SharingParticipant = AvailableParticipantDTO & {
  addedBy: string[];
};

export const isSharingParticipant = (
  participant: AvailableParticipantDTO | SharingParticipant
): participant is SharingParticipant => {
  return 'addedBy' in participant;
};

export const MANUALLY_ADDED = 'Manual';

export const isAddedByManual = (participant: SharingParticipant) => {
  return participant.addedBy.includes(MANUALLY_ADDED);
};

export type ParticipantTSType = AvailableParticipantDTO | SharingParticipant;

export function filterParticipants<T extends ParticipantTSType>(
  participants: T[],
  filterText: string,
  selectedTypeIds?: Set<number>
) {
  let filtered = participants;

  if (selectedTypeIds && selectedTypeIds.size > 0) {
    filtered = filtered.filter((p) => p.types?.some((t) => selectedTypeIds.has(t.id)));
  }

  if (filterText) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(filterText.toLowerCase()));
  }

  return filtered;
}

export function isSelectedAll(
  filteredParticipants: ParticipantTSType[],
  checkedParticipants: Set<number>
) {
  if (!filteredParticipants.length || !checkedParticipants.size) return false;
  return filteredParticipants.every((p) => checkedParticipants.has(p.siteId!));
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

export function formatSourceColumn(sources: string[]) {
  let sourceField = '';
  const sourcesCopy = [...sources];
  const manualIndex = sourcesCopy.indexOf(MANUALLY_ADDED);

  if (manualIndex !== -1) {
    sourceField = MANUALLY_ADDED;
    sourcesCopy.splice(manualIndex, 1);
  }

  if (sourcesCopy.length > 0) {
    if (sourceField) {
      sourceField += ' and ';
    }
    sourceField += `Auto: ${sourcesCopy.join(', ')}`;
  }
  return sourceField;
}
