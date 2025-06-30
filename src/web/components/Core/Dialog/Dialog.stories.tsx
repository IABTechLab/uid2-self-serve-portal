import { Meta } from '@storybook/react-webpack5';
import { useState } from 'react';

import { Dialog } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Shared Components/Dialog',
  component: Dialog,
};

export default meta;

export const Default = {
  args: {
    title: 'Dialog Title',
    closeButtonText: 'Close',
    children: 'Dialog content goes here',
  },
};

export const WithoutTitle = {
  args: {
    ...Default.args,
    title: undefined,
  },
};

export const WithoutCloseText = {
  args: {
    ...Default.args,
    closeButtonText: undefined,
  },
};

export const WithoutCloseButtons = {
  args: {
    ...Default.args,
    closeButtonText: undefined,
    hideCloseButtons: true,
  },
};

export const WithOpenAndOnOpenChange = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className='small-button' type='button' onClick={handleOpenChange}>
        Open Dialog
      </button>
      {isOpen && (
        <Dialog title='Dialog Title' onOpenChange={handleOpenChange}>
          Dialog content goes here
        </Dialog>
      )}
    </div>
  );
};
