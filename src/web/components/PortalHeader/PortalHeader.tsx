import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import * as Switch from '@radix-ui/react-switch';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { CurrentUserContext } from '../../contexts/CurrentUserProvider';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { AuditTrailRoute } from '../../screens/auditTrailScreen';
import { EmailContactsRoute } from '../../screens/emailContacts';
import { ParticipantInformationRoute } from '../../screens/participantInformation';
import { TeamMembersRoute } from '../../screens/teamMembers';
import { getPathWithParticipant } from '../../utils/urlHelpers';
import { isUserAdminOrSupport } from '../../utils/userRoleHelpers';

import './PortalHeader.scss';

export type PortalHeaderProps = {
  email: string | undefined;
  fullName: string | undefined;
  setDarkMode?: (darkMode: boolean) => void;
  logout: () => void;
};

export function PortalHeader({
  email,
  fullName,
  setDarkMode = undefined,
  logout,
}: Readonly<PortalHeaderProps>) {
  const { participant } = useContext(ParticipantContext);
  const { LoggedInUser } = useContext(CurrentUserContext);
  const user = LoggedInUser?.user;

  const routes = [ParticipantInformationRoute, TeamMembersRoute, EmailContactsRoute];

  if (user && participant && isUserAdminOrSupport(user, participant.id)) {
    routes.push(AuditTrailRoute);
  }

  const showUserNavigationAndSettings = user?.acceptedTerms && user?.participants!.length > 0;

  const [menuOpen, setMenuOpen] = useState(false);
  const handleSelect = () => {
    setMenuOpen(false);
  };

  const lastDarkState = localStorage.getItem('isDarkMode') === 'true';
  const [darkToggleState, setDarkToggleState] = useState(lastDarkState);
  const onThemeToggle = () => {
    setDarkToggleState(!darkToggleState);
  };

  useEffect(() => {
    setDarkMode?.(darkToggleState);
  }, [darkToggleState, setDarkMode]);

  return (
    <header className='portal-header'>
      <div className='title'>
        <Link data-testid='title-link' to={`/participant/${participant?.id}/home`}>
          <img
            src={darkToggleState ? '/uid2-logo-darkmode.svg' : '/uid2-logo.svg'}
            alt='UID2 logo'
            className='uid2-logo'
          />
        </Link>
      </div>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger className='profile-dropdown-button'>
          {email ? fullName : 'Not logged in'}
          <FontAwesomeIcon icon='chevron-down' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='profile-dropdown-content' align='end'>
          <DropdownMenuArrow className='profile-dropdown-arrow' />
          {showUserNavigationAndSettings && (
            <>
              {routes.map((route) => {
                return (
                  <DropdownMenuItem
                    key={getPathWithParticipant(route.path, participant?.id)}
                    className='dropdown-menu-item'
                    onClick={handleSelect}
                  >
                    <Link to={getPathWithParticipant(route.path, participant?.id)} className='link'>
                      {route.description}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <div className='theme-switch'>
                  <label htmlFor='dark-mode'>Dark Mode</label>
                  <Switch.Root
                    name='dark-mode'
                    checked={darkToggleState}
                    onCheckedChange={onThemeToggle}
                    className='theme-toggle clickable-item'
                  >
                    <Switch.Thumb className='thumb' />
                  </Switch.Root>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className='separator' />
            </>
          )}
          <DropdownMenuItem className='dropdown-menu-item' onClick={logout}>
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
