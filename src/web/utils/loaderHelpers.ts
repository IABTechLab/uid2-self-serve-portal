import { LoaderFunctionArgs } from 'react-router-dom';
import { defer, makeLoader } from 'react-router-typesafe';

import { parseParticipantId } from './urlHelpers';

type ParticipantLoaderFunction<T extends ReturnType<typeof defer>> = (
  participantId: number,
  args: LoaderFunctionArgs
) => T;

/**
 * Makes a loader that is enriched with the participantId from the URL
 */
export const makeParticipantLoader = <T extends ReturnType<typeof defer>>(
  loaderFn: ParticipantLoaderFunction<T>
) => {
  return makeLoader((args: LoaderFunctionArgs) => {
    const participantId = parseParticipantId(args.params.participantId);
    return loaderFn(participantId!, args);
  });
};
