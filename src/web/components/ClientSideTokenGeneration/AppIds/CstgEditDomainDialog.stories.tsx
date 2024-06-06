import { Meta } from '@storybook/react';
import { useState } from 'react';

import CstgEditAppIdDialog from './CstgEditAppIdDialog';

const meta: Meta<typeof CstgEditAppIdDialog> = {
  title: 'CSTG/App Ids/Edit Mobile App ID Dialog',
  component: CstgEditAppIdDialog,
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
        <CstgEditAppIdDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          appId='com.test.com'
          existingAppIds={['1234356']}
          onEditAppId={(updatedAppId) => {
            console.log('Mobile App id edited: ', updatedAppId);
            setIsOpen(!isOpen);
            return Promise.resolve(true);
          }}
        />
      )}
    </div>
  );
};
