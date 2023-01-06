import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { PortalHeader } from './components/Core/PortalHeader';
import { SideNav } from './components/Core/SideNav';
import { SnailTrail } from './components/Core/SnailTrail';
import { Routes } from './screens/routes';
import { userStore } from './stores/userStore';

import './App.scss';

library.add(faEllipsisH);
const menu = Routes.filter((r) => r.description);

export function App() {
  const location = useLocation();
  const currentLocationDescription = menu.filter((m) => m.path === location.pathname)[0]
    .description;
  return (
    <div className='app'>
      <PortalHeader username={userStore.username} />
      <div className='app-panel'>
        <SideNav menu={menu} />
        <div className='content'>
          <SnailTrail location={currentLocationDescription} />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
