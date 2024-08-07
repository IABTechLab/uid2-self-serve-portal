import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Loading.scss';

type LoadingProps = Readonly<{
  message?: string;
}>;
export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className='loading-component'>
      <FontAwesomeIcon icon='spinner' spin />
      <span>{message}</span>
    </div>
  );
}
