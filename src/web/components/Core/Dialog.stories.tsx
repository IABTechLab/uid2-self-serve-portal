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
  triggerButton: 'Open Dialog',
  title: 'Dialog Title',
  closeButton: 'Close',
  children: 'Dialog content goes here',
};

export const WithoutTitle = Template.bind({});
WithoutTitle.args = {
  ...Default.args,
  title: undefined,
};

export const WithoutCloseButton = Template.bind({});
WithoutCloseButton.args = {
  ...Default.args,
  closeButton: undefined,
};

export const WithOpenAndOnOpenChange = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenChange = (open: boolean) => setIsOpen(open);

  return (
    <div>
      <Dialog
        title='Dialog Title'
        triggerButton='Open Dialog'
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
