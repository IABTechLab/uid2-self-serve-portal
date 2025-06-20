import { Meta } from '@storybook/react-webpack5';
import { useState } from 'react';

import CstgAddDialog from './CstgAddDialog';
import { CstgValueType } from './CstgHelper';

const meta: Meta<typeof CstgAddDialog> = {
  title: 'CSTG/Add Dialog',
  component: CstgAddDialog,
};
export default meta;

export const AddDomains = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgAddDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          existingCstgValues={[]}
          onAddCstgValues={(newCstgValuesFormatted, deleteExistingList) => {
            setIsOpen(!isOpen);
            console.log(
              `Adding Domains ${JSON.stringify(newCstgValuesFormatted)}, ${
                deleteExistingList ? `Deleting existing list` : `Keeping existing list`
              }`
            );
            return Promise.resolve([]);
          }}
          cstgValueType={CstgValueType.Domain}
          addInstructions='Add one or more domains.'
        />
      )}
    </div>
  );
};

export const AddMobileAppIds = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <CstgAddDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          existingCstgValues={[]}
          onAddCstgValues={(newCstgValuesFormatted, deleteExistingList) => {
            setIsOpen(!isOpen);
            console.log(
              `Adding Mobile App IDs ${JSON.stringify(newCstgValuesFormatted)}, ${
                deleteExistingList ? `Deleting existing list` : `Keeping existing list`
              }`
            );
            return Promise.resolve([]);
          }}
          cstgValueType={CstgValueType.MobileAppId}
          addInstructions='Please register the Android App ID, iOS/tvOS Bundle ID and iOS App Store ID.'
        />
      )}
    </div>
  );
};
