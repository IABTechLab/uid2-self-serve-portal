import { Meta, StoryFn } from '@storybook/react';

import { ParticipantItemSimple } from './ParticipantItem';

export default {
  title: 'Sharing Permissions/ParticipantItemSimple',
  component: ParticipantItemSimple,
} as Meta<typeof ParticipantItemSimple>;

const Template: StoryFn<typeof ParticipantItemSimple> = (args) => (
  <table>
    <tbody>
      <tr>
        <ParticipantItemSimple {...args} />
      </tr>
    </tbody>
  </table>
);

export const Default = {
  render: Template,

  args: {
    site: {
      id: 1,
      name: 'Participant 1',
      clientTypes: ['DSP'],
      canBeSharedWith: true,
    },
  },
};
