import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { Dialog } from './Dialog';

export default {
  title: 'Shared Components/Dialog',
  component: Dialog,
} as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = (args) => <Dialog {...args} />;

export const Default = Template.bind({});
Default.args = {
  triggerButton: (
    <button className='small-button' type='button'>
      Open Dialog
    </button>
  ),
  title: 'Dialog Title',
  closeButtonText: 'Close',
  children: 'Dialog content goes here',
};

export const WithoutTitle = Template.bind({});
WithoutTitle.args = {
  ...Default.args,
  title: undefined,
};

export const WithoutCloseText = Template.bind({});
WithoutCloseText.args = {
  ...Default.args,
  closeButtonText: undefined,
};

export const WithoutCloseButtons = Template.bind({});
WithoutCloseButtons.args = {
  ...Default.args,
  closeButtonText: undefined,
  hideCloseButtons: true,
};

export const WithOpenAndOnOpenChange = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenChange = (open: boolean) => setIsOpen(open);

  return (
    <div>
      <Dialog
        title='Dialog Title'
        triggerButton={
          <button className='small-button' type='button'>
            Open Dialog
          </button>
        }
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        Dialog content goes here
      </Dialog>
      <button type='button' onClick={() => setIsOpen(true)}>
        Open
      </button>
    </div>
  );
};
