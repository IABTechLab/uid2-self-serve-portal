import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import * as Switch from '@radix-ui/react-switch';
import { createHash } from 'crypto';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './PortalHeader.scss';

export type PortalHeaderProps = {
  username: string | undefined;
  setDarkMode: (darkMode: boolean) => void;
};

export function PortalHeader({ username, setDarkMode }: PortalHeaderProps) {
  const emailMd5 = username ? createHash('md5').update(username).digest('hex') : null;
  const [darkToggleState, setDarkToggleState] = useState(true);
  const onThemeToggle = () => {
    setDarkToggleState(!darkToggleState);
  };
  useEffect(() => {
    setDarkMode(darkToggleState);
  }, [darkToggleState, setDarkMode]);

  return (
    <div className='portal-header' role='banner'>
      <div className='title'>
        <Link data-testid='title-link' to='/'>
          UID2 Portal
        </Link>
      </div>
      <div className='theme-switch'>
        <label htmlFor='dark-mode'>
          Dark mode
          <Switch.Root
            name='dark-mode'
            checked={darkToggleState}
            onCheckedChange={onThemeToggle}
            className='theme-toggle'
          >
            <Switch.Thumb className='thumb' />
          </Switch.Root>
        </label>
      </div>
      <Avatar className='portal-avatar'>
        {!!username && (
          <AvatarImage
            src={`//www.gravatar.com/avatar/${emailMd5}.jpg`}
            alt={`Profile image for ${username}`}
            onLoadingStatusChange={() => 'loaded'}
          />
        )}
      </Avatar>
    </div>
  );
}
