import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { createHash } from 'crypto';
import { Link } from 'react-router-dom';

import './PortalHeader.scss';

export type PortalHeaderProps = {
  username: string;
};

export function PortalHeader({ username }: PortalHeaderProps) {
  const emailMd5 = createHash('md5').update(username).digest('hex');

  return (
    <div className='portal-header'>
      <div className='title'>
        <Link to='/'>UID2 Portal</Link>
      </div>
      <Avatar className='portal-avatar'>
        <AvatarImage src={`//www.gravatar.com/avatar/${emailMd5}.jpg`} alt={username} />
      </Avatar>
    </div>
  );
}
