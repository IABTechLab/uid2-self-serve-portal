import clsx from 'clsx';
import Fuse from 'fuse.js';

/*
Fuse gives us a list of spans to highlight - e.g. in "Testing Site", if the search is "Test Site", the highlights
might be [[0, 3], [8, 11]] to highlight the words "Test" and "Site".
This converts that list into a set of spans covering the whole string, with whether to highlight each span or not.
*/
const getSpans = (matches: [number, number][], totalLength: number) => {
  const spans = matches
    .reduce(
      (acc, next) => {
        const gapFromPreviousHighlight = {
          start: acc[acc.length - 1].end + 1,
          end: next[0] - 1,
          highlight: false,
        };
        const nextSpan = { start: next[0], end: next[1], highlight: true };
        return [...acc, gapFromPreviousHighlight, nextSpan];
      },
      [{ start: -1, end: -1, highlight: false }] // Initial state so the first span starts at 0 - we'll remove it later
    )
    .slice(1);
  const finalSpan = {
    start: matches.length > 0 ? matches[matches.length - 1][1] + 1 : 0,
    end: totalLength - 1,
    highlight: false,
  };
  return [...spans, finalSpan];
};

type HighlightedResultProps<T> = Readonly<{
  result: Fuse.FuseResult<T>;
  resultText: string;
}>;
export function HighlightedResult<T>({ result, resultText }: HighlightedResultProps<T>) {
  if (!result.matches || result.matches.length < 1) return <span>{resultText}</span>;
  const spans = getSpans([...result.matches[0].indices], resultText.length);
  return (
    <>
      {spans.map((s) => (
        <span key={`${s.start}-${s.end}`} className={clsx({ highlight: s.highlight })}>
          {resultText.slice(s.start, s.end + 1)}
        </span>
      ))}
    </>
  );
}
