import { Meta } from '@storybook/react';
import { useState } from 'react';

import CstgEditDomainDialog from './CstgEditDomainDialog';

const meta: Meta<typeof CstgEditDomainDialog> = {
  title: 'CSTG/CstgEditDomainDialog',
  component: CstgEditDomainDialog,
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
        <CstgEditDomainDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          domain='testdomain.com'
          existingDomains={['test.com', 'test2.com']}
          onEditDomainName={(updatedDomain) => {
            Promise.resolve(console.log('New domain added: ', updatedDomain));
            setIsOpen(!isOpen);
          }}
        />
      )}
    </div>
  );
};
