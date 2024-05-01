import { Meta } from '@storybook/react';
import { useState } from 'react';

import CstgDeleteDomainDialog from './CstgDeleteDomainDialog';

const meta: Meta<typeof CstgDeleteDomainDialog> = {
  title: 'CSTG/Domains/Delete Domain Dialog',
  component: CstgDeleteDomainDialog,
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
        <CstgDeleteDomainDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          domains={['testdomain.com']}
          onRemoveDomains={() => {
            Promise.resolve(console.log(`Disabling Domain`));
            setIsOpen(!isOpen);
          }}
        />
      )}
    </div>
  );
};

export const MultipleDomains = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgDeleteDomainDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          domains={['testdomain.com', 'testdomain2.com', 'testdomain3.com']}
          onRemoveDomains={() => {
            Promise.resolve(console.log(`Disabling Domain`));
            setIsOpen(!isOpen);
          }}
        />
      )}
    </div>
  );
};
