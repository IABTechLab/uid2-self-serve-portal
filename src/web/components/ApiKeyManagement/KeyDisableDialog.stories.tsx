/* eslint-disable camelcase */

import type { Meta } from '@storybook/react';
import { useState } from 'react';

import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import KeyDisableDialog from './KeyDisableDialog';

const meta: Meta<typeof KeyDisableDialog> = {
  component: KeyDisableDialog,
  title: 'Api Management/Key Disable Dialog',
};
export default meta;

const apiKey = {
  contact: 'ApiKey',
  name: 'Test ApiKey 1',
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

export const DisableApiKey = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <KeyDisableDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          apiKey={apiKey}
          onDisable={(key: ApiKeyDTO) => {
            console.log(`Disabling Key ${key.name}`);
            setIsOpen(!isOpen);
          }}
        />
      )}
    </div>
  );
};
