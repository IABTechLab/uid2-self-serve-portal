import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type LoadingProps = Readonly<{
  innerText?: string;
}>;
export function Loading({ innerText = 'Loading...' }: LoadingProps) {
  return (
    <div>
      <FontAwesomeIcon icon='spinner' spin /> {innerText}
    </div>
  );
}
