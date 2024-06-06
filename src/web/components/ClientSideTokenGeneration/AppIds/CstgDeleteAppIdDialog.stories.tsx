import { Meta } from '@storybook/react';
import { useState } from 'react';

import CstgDeleteAppIdDialog from './CstgDeleteAppIdDialog';

const meta: Meta<typeof CstgDeleteAppIdDialog> = {
  title: 'CSTG/Mobile App Ids/Delete Mobile App ID Dialog',
  component: CstgDeleteAppIdDialog,
};
export default meta;

export const Default = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const appId = ['com.test.com'];

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgDeleteAppIdDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          appIds={appId}
          onRemoveAppIds={() => {
            Promise.resolve(console.log(`Disabling Mobile App ID: ${JSON.stringify(appId)}`));
            setIsOpen(!isOpen);
          }}
        />
      )}
    </div>
  );
};

export const MultipleAppIds = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const appIds = ['com.test.com', '123456', 'test-123.com'];

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgDeleteAppIdDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          appIds={appIds}
          onRemoveAppIds={() => {
            Promise.resolve(console.log(`Disabling Mobile App IDs: ${JSON.stringify(appIds)}`));
            setIsOpen(!isOpen);
          }}
        />
      )}
    </div>
  );
};
