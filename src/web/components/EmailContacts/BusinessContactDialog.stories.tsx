import type { Meta } from '@storybook/react-webpack5';
import { useState } from 'react';

import { ContactType } from '../../../api/entities/BusinessContact';
import BusinessContactDialog from './EmailContactDialog';

const meta: Meta<typeof BusinessContactDialog> = {
  component: BusinessContactDialog,
  title: 'Business Contacts/Business Contacts Dialog',
};
export default meta;

export const WithoutBusinessContact = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <BusinessContactDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          onFormSubmit={(formData) =>
            Promise.resolve(console.log(`contact from submit with ${JSON.stringify(formData)}`))
          }
        />
      )}
    </div>
  );
};

export const WithBusinessContact = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <BusinessContactDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          onFormSubmit={(formData) =>
            Promise.resolve(console.log(`contact from submit with ${JSON.stringify(formData)}`))
          }
          contact={{
            id: 1,
            name: 'Business Team',
            emailAlias: 'Business_team@test.com',
            contactType: ContactType.Business,
            participantId: 1,
          }}
        />
      )}
    </div>
  );
};
