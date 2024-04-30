/* eslint-disable camelcase */
import type { Meta } from '@storybook/react';
import { useState } from 'react';

import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import KeyEditDialog from './KeyEditDialog';

const meta: Meta<typeof KeyEditDialog> = {
  component: KeyEditDialog,
  title: 'Api Management/Edit Key Dialog',
};
export default meta;

const availableRoles = [
  { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
  { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
  { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
  { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
];

const apiKeyInitial = {
  contact: 'ApiKey',
  name: 'ApiKey',
  created: 1702830516,
  key_id: 'F4lfa.fdas',
  site_id: 1,
  disabled: false,
  roles: [
    { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
    { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
  ],
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
          availableRoles={availableRoles}
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
            roles: availableRoles.slice(0, 2),
          }}
          availableRoles={availableRoles.slice(1, 3)}
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
            roles: [availableRoles[0]],
          }}
          availableRoles={[availableRoles[0]]}
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
