import { CheckedState } from '@radix-ui/react-checkbox';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { TriStateCheckboxState } from '../Core/TriStateCheckbox';

export const MANUALLY_ADDED = 'Manual';
export type SharingParticipant = AvailableParticipantDTO & {
  addedBy: (ParticipantTypeDTO | typeof MANUALLY_ADDED)[];
};

export const isSharingParticipant = (
  participant: AvailableParticipantDTO | SharingParticipant
): participant is SharingParticipant => {
  return 'addedBy' in participant;
};

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

export function formatSourceColumn(sources: SharingParticipant['addedBy']) {
  let sourceField = '';
  const sourcesText = [...sources.map((s) => (s === MANUALLY_ADDED ? MANUALLY_ADDED : s.typeName))];
  const manualIndex = sourcesText.indexOf(MANUALLY_ADDED);

  if (manualIndex !== -1) {
    sourceField = MANUALLY_ADDED;
    sourcesText.splice(manualIndex, 1);
  }

  if (sourcesText.length > 0) {
    if (sourceField) {
      sourceField += ' and ';
    }
    sourceField += `Auto: ${sourcesText.join(', ')}`;
  }
  return sourceField;
}
