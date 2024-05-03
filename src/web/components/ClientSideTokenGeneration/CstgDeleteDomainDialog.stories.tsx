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
  const domain = ['testdomain.com'];

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgDeleteDomainDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          domains={domain}
          onRemoveDomains={() => {
            Promise.resolve(console.log(`Disabling Domain: ${JSON.stringify(domain)}`));
            setIsOpen(!isOpen);
          }}
        />
      )}
    </div>
  );
};

export const MultipleDomains = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const domains = ['testdomain.com', 'testdomain2.com', 'testdomain3.com'];

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgDeleteDomainDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          domains={domains}
          onRemoveDomains={() => {
            Promise.resolve(console.log(`Disabling Domains: ${JSON.stringify(domains)}`));
            setIsOpen(!isOpen);
          }}
        />
      )}
    </div>
  );
};
