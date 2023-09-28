import type { Meta, StoryObj } from '@storybook/react';

import Popover from './Popover';

const meta: Meta<typeof Popover> = {
  component: Popover,
  title: 'Shared Components/Popover',
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    triggerButton: (
      <button className='small-button' type='button'>
        Open Popover
      </button>
    ),
    children:
      'UID2-X-L-MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEQ6UZYyjvGEg5Cydtmzo/CvTOJc618g8iAOpBtDMO0GE7BZ2IWGwvkG6tdL1QBLXdwnICG+xZpOziF1Z6Cxc+Bw==',
  },
};

// export const WithKeyPair: Story = {
//   args: {
//     ...Default.args,
//     keyPair: {
//       subscriptionId: 'subscription 1',
//       siteId: 1234,
//       publicKey: 'public key 1',
//       created: new Date(),
//       createdString: new Date().toLocaleDateString(),
//       disabled: false,
//     },
//   },
// };

// import { ComponentMeta, ComponentStory } from '@storybook/react';
// import { useState } from 'react';

// import { Dialog } from './Dialog';

// export default {
//   title: 'Shared Components/Popover',
//   component: Dialog,
// } as ComponentMeta<typeof Dialog>;

// const Template: ComponentStory<typeof Dialog> = (args) => <Dialog {...args} />;

// export const Default = Template.bind({});
// Default.args = {
//   triggerButton: (
//     <button className='small-button' type='button'>
//       Open Dialog
//     </button>
//   ),
//   title: 'Dialog Title',
//   closeButton: 'Close',
//   children: 'Dialog content goes here',
// };

// export const WithoutTitle = Template.bind({});
// WithoutTitle.args = {
//   ...Default.args,
//   title: undefined,
// };

// export const WithoutCloseButton = Template.bind({});
// WithoutCloseButton.args = {
//   ...Default.args,
//   closeButton: undefined,
// };

// export const WithOpenAndOnOpenChange = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const handleOpenChange = (open: boolean) => setIsOpen(open);

//   return (
//     <div>
//       <Dialog
//         title='Dialog Title'
//         triggerButton={
//           <button className='small-button' type='button'>
//             Open Dialog
//           </button>
//         }
//         open={isOpen}
//         onOpenChange={handleOpenChange}
//       >
//         Dialog content goes here
//       </Dialog>
//       <button type='button' onClick={() => setIsOpen(true)}>
//         Open
//       </button>
//     </div>
//   );
// };
