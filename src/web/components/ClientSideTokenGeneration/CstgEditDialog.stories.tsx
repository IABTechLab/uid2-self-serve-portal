import { Meta } from '@storybook/react-webpack5';
import { useState } from 'react';

import CstgEditDialog from './CstgEditDialog';
import { CstgValueType } from './CstgHelper';

const meta: Meta<typeof CstgEditDialog> = {
  title: 'CSTG/Edit Dialog',
  component: CstgEditDialog,
};
export default meta;

export const EditDomain = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgEditDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          cstgValue='testdomain.com'
          existingCstgValues={['test.com', 'test2.com']}
          onEdit={(updatedDomain) => {
            console.log('Domain edited: ', updatedDomain);
            setIsOpen(!isOpen);
            return Promise.resolve(true);
          }}
          cstgValueType={CstgValueType.Domain}
        />
      )}
    </div>
  );
};

export const EditMobileAppID = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgEditDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          cstgValue='com.test.com'
          existingCstgValues={['123456', 'test']}
          onEdit={(updatedAppId) => {
            console.log('Mobile app id edited: ', updatedAppId);
            setIsOpen(!isOpen);
            return Promise.resolve(true);
          }}
          cstgValueType={CstgValueType.MobileAppId}
        />
      )}
    </div>
  );
};
