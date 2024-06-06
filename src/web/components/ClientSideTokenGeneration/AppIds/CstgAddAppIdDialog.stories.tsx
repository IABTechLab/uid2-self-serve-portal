import { Meta } from '@storybook/react';
import { useState } from 'react';

import CstgAddAppIdDialog from './CstgAddAppIdDialog';

const meta: Meta<typeof CstgAddAppIdDialog> = {
  title: 'CSTG/Mobile App Ids/Add Mobile App ID Dialog',
  component: CstgAddAppIdDialog,
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
        <CstgAddAppIdDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          existingAppIds={[]}
          onAddAppIds={(newAppIdsFormatted, deleteExistingList) => {
            setIsOpen(!isOpen);
            console.log(
              `Adding Mobile App Ids ${JSON.stringify(newAppIdsFormatted)}, ${
                deleteExistingList ? `Deleting existing list` : `Keeping existing list`
              }`
            );
            return Promise.resolve([]);
          }}
        />
      )}
    </div>
  );
};
