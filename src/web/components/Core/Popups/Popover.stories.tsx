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
