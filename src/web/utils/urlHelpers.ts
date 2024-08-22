export const parseParticipantId = (participantId: string | undefined) => {
  if (!participantId) {
    throw new Error('Participant ID is not defined');
  }
  const result = parseInt(participantId, 10);
  if (isNaN(result)) {
    throw new Error('Participant ID is not a valid number');
  }
  return result;
};

export const extractLocationFromPath = (path: string) => {
  // Check if the path is exactly "/:participantId" or "participant/:participantId"
  if (/^\/?:?participantId\/?$/.test(path)) {
    return '';
  }

  // Use a regular expression to match "participant/:participantId" or "/:participantId"
  const regex = /^\/?participant\/[^/]+\/?(.*)$/;

  // Apply the regular expression to the input path.
  const match = RegExp(regex).exec(path);

  // If there's a match, return the captured group, otherwise return the original path.
  return match ? match[1] : path.replace(/^\/?:?participantId\/?/, '');
};

export function getPathWithParticipant(path: string, participantId: string | undefined) {
  const location = extractLocationFromPath(path);
  return `/participant/${participantId}/${location}`;
}
