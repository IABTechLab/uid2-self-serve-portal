import { Meta } from '@storybook/react';
import { useState } from 'react';

import CstgAddDomainDialog from './CstgAddDomainDialog';

const meta: Meta<typeof CstgAddDomainDialog> = {
  title: 'CSTG/CstgAddDomainDialog',
  component: CstgAddDomainDialog,
};
export default meta;

export const Default = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgAddDomainDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          existingDomains={[]}
          onAddDomains={(newDomainsFormatted, deleteExistingList) => {
            setIsOpen(!isOpen);
            return Promise.resolve(
              console.log(
                `Adding Domains ${JSON.stringify(newDomainsFormatted)}, ${
                  deleteExistingList ? `Keeping existing list` : `Deleting existing list`
                }`
              )
            );
          }}
        />
      )}
    </div>
  );
};
