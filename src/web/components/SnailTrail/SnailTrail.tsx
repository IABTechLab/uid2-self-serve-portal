import './SnailTrail.scss';

type SnailTrailProps = Readonly<{
  location: string;
}>;
export function SnailTrail({ location }: SnailTrailProps) {
  return <div className='snail-trail'>UID2 &gt; {location}</div>;
}
