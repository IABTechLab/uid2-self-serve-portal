import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type LoadingProps = Readonly<{
  message?: string;
}>;
export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div>
      <FontAwesomeIcon icon='spinner' spin /> {message}
    </div>
  );
}
