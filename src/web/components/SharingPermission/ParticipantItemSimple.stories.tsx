import { Meta, StoryObj } from '@storybook/react';

import { ParticipantItemSimple } from './ParticipantItem';

const meta: Meta<typeof ParticipantItemSimple> = {
  title: 'Sharing Permissions/Participant Item Simple',
  component: ParticipantItemSimple,
  decorators: [
    (Story) => (
      <table>
        <tbody>
          <tr>
            <Story />
          </tr>
        </tbody>
      </table>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ParticipantItemSimple>;

export const Default: Story = {
  args: {
    site: {
      id: 1,
      name: 'Participant 1',
      clientTypes: ['DSP'],
      canBeSharedWith: true,
    },
  },
};
