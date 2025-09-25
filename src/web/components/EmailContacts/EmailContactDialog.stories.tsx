import type { Meta } from '@storybook/react-webpack5';
import { useState } from 'react';

import { ContactType } from '../../../api/entities/EmailContact';
import EmailContactDialog from './EmailContactDialog';

const meta: Meta<typeof EmailContactDialog> = {
  component: EmailContactDialog,
  title: 'Email Contacts/Email Contacts Dialog',
};
export default meta;

export const WithoutEmailContact = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <EmailContactDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          onFormSubmit={(formData) =>
            Promise.resolve(console.log(`contact from submit with ${JSON.stringify(formData)}`))
          }
        />
      )}
    </div>
  );
};

export const WithEmailContact = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <EmailContactDialog
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
