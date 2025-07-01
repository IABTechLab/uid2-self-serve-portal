import { Meta } from '@storybook/react-webpack5';
import { useState } from 'react';

import CstgDeleteDialog from './CstgDeleteDialog';
import { CstgValueType } from './CstgHelper';

const meta: Meta<typeof CstgDeleteDialog> = {
  title: 'CSTG/Delete Dialog',
  component: CstgDeleteDialog,
};
export default meta;

export const SingleDomain = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const domain = ['testdomain.com'];

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgDeleteDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          cstgValues={domain}
          onRemoveCstgValues={() => {
            Promise.resolve(console.log(`Disabling Domain: ${JSON.stringify(domain)}`));
            setIsOpen(!isOpen);
          }}
          cstgValueType={CstgValueType.Domain}
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
        <CstgDeleteDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          cstgValues={domains}
          onRemoveCstgValues={() => {
            Promise.resolve(console.log(`Disabling Domains: ${JSON.stringify(domains)}`));
            setIsOpen(!isOpen);
          }}
          cstgValueType={CstgValueType.Domain}
        />
      )}
    </div>
  );
};

export const SingleMobileAppID = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const appId = ['com.test.com'];

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgDeleteDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          cstgValues={appId}
          onRemoveCstgValues={() => {
            Promise.resolve(console.log(`Disabling Mobile App ID: ${JSON.stringify(appId)}`));
            setIsOpen(!isOpen);
          }}
          cstgValueType={CstgValueType.MobileAppId}
        />
      )}
    </div>
  );
};

export const MultipleMobileAppIDs = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const appIds = ['com.test.com', '123456', '123.456.abc'];

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgDeleteDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          cstgValues={appIds}
          onRemoveCstgValues={() => {
            Promise.resolve(console.log(`Disabling Mobile App IDs: ${JSON.stringify(appIds)}`));
            setIsOpen(!isOpen);
          }}
          cstgValueType={CstgValueType.MobileAppId}
        />
      )}
    </div>
  );
};
