/* eslint-disable camelcase */
import type { Meta } from '@storybook/react';
import { useState } from 'react';

import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import KeyEditDialog from './KeyEditDialog';
import { allApiRoles, Generator, Mapper } from './KeyHelper.spec';

const meta: Meta<typeof KeyEditDialog> = {
  component: KeyEditDialog,
  title: 'Api Management/Key Edit Dialog',
};
export default meta;

const apiKeyInitial = {
  contact: 'ApiKey',
  name: 'ApiKey',
  created: 1702830516,
  key_id: 'F4lfa.fdas',
  site_id: 1,
  disabled: false,
  roles: [Mapper, Generator],
  service_id: 0,
};

export const MultipleRoles = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<ApiKeyDTO>(apiKeyInitial);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <KeyEditDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          apiKey={apiKey}
          availableRoles={allApiRoles}
          onEdit={(form) => {
            console.log(form);
            return Promise.resolve();
          }}
          setApiKey={setApiKey}
        />
      )}
    </div>
  );
};

export const KeyWithRolesParticipantIsntAllowed = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<ApiKeyDTO>(apiKeyInitial);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <KeyEditDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          apiKey={{
            ...apiKey,
            roles: allApiRoles.slice(0, 2),
          }}
          availableRoles={allApiRoles.slice(1, 3)}
          onEdit={(form) => {
            console.log(form);
            return Promise.resolve();
          }}
          setApiKey={setApiKey}
        />
      )}
    </div>
  );
};

export const KeyWithOnlyOneRole = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<ApiKeyDTO>(apiKeyInitial);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <KeyEditDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          apiKey={{
            ...apiKey,
            roles: [allApiRoles[0]],
          }}
          availableRoles={[allApiRoles[0]]}
          onEdit={(form) => {
            console.log(form);
            return Promise.resolve();
          }}
          setApiKey={setApiKey}
        />
      )}
    </div>
  );
};
