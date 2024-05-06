import type { Meta } from '@storybook/react';
import { useState } from 'react';

import KeyCreationDialog from './KeyCreationDialog';

const meta: Meta<typeof KeyCreationDialog> = {
  component: KeyCreationDialog,
  title: 'Api Management/Key Creation Dialog',
};
export default meta;

export const MultipleRoles = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <KeyCreationDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          availableRoles={[
            { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
            { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
            { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
            { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
          ]}
          onKeyCreation={(form) => {
            console.log(`Add a new Key ${JSON.stringify(form)}`);
            return Promise.resolve({
              plaintextKey: 'Test_Plaintext',
              secret: 'Test_Secret',
              name: 'Test_Key',
            });
          }}
        />
      )}
    </div>
  );
};

export const OneRole = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <KeyCreationDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          availableRoles={[{ id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 }]}
          onKeyCreation={(form) => {
            console.log(`Add a new Key ${JSON.stringify(form)}`);
            return Promise.resolve({
              plaintextKey: 'Test_Plaintext',
              secret: 'Test_Secret',
              name: 'Test_Key',
            });
          }}
        />
      )}
    </div>
  );
};
