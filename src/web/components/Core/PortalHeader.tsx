import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import * as Switch from '@radix-ui/react-switch';
import MD5 from 'crypto-js/md5';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './PortalHeader.scss';

export type PortalHeaderProps = {
  email: string | undefined;
  fullname: string | undefined;
  setDarkMode?: (darkMode: boolean) => void;
  logout: () => void;
};

export function PortalHeader({
  email,
  fullname,
  setDarkMode = undefined,
  logout,
}: PortalHeaderProps) {
  const emailMd5 = email ? MD5(email).toString() : null;
  const [darkToggleState, setDarkToggleState] = useState(false);
  const onThemeToggle = () => {
    setDarkToggleState(!darkToggleState);
  };
  useEffect(() => {
    setDarkMode?.(darkToggleState);
  }, [darkToggleState, setDarkMode]);
  return (
    <div className='portal-header' role='banner'>
      <div className='title'>
        <Link data-testid='title-link' to='/'>
          <img src='/uid2-logo.png' alt='UID2 logo' className='uid2-logo' />
        </Link>
      </div>
      <DropdownMenu defaultOpen={false}>
        <DropdownMenuTrigger className='profile-dropdown-button'>
          {email ? fullname : 'Not logged in'}
          <FontAwesomeIcon icon='chevron-down' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='profile-dropdown-content' align='end'>
          <DropdownMenuArrow className='profile-dropdown-arrow' />
          <div className='portal-avatar-container'>
            <Avatar className='portal-avatar' asChild>
              {!!email && (
                <img src={`//www.gravatar.com/avatar/${emailMd5}.jpg`} alt='Profile avatar' />
              )}
            </Avatar>
          </div>
          <DropdownMenuSeparator className='separator' />
          <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
            <div className='theme-switch'>
              <label htmlFor='dark-mode'>Dark mode</label>
              <Switch.Root
                name='dark-mode'
                checked={darkToggleState}
                onCheckedChange={onThemeToggle}
                className='theme-toggle'
              >
                <Switch.Thumb className='thumb' />
              </Switch.Root>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className='separator' />
          <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
            <div className='theme-switch'>
              <label htmlFor='dark-mode'>Dark mode</label>
              <Switch.Root
                name='dark-mode'
                checked={darkToggleState}
                onCheckedChange={onThemeToggle}
                className='theme-toggle'
              >
                <Switch.Thumb className='thumb' />
              </Switch.Root>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className='separator' />
          <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
