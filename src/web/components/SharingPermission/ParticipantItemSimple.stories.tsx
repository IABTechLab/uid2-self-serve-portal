import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantItemSimple } from './ParticipantItem';

export default {
  title: 'Sharing Permissions/Participant Item Simple',
  component: ParticipantItemSimple,
} as ComponentMeta<typeof ParticipantItemSimple>;

const Template: ComponentStory<typeof ParticipantItemSimple> = (args) => (
  <table>
    <tbody>
      <tr>
        <ParticipantItemSimple {...args} />
      </tr>
    </tbody>
  </table>
);

export const Default = Template.bind({});
Default.args = {
  site: {
    id: 1,
    name: 'Participant 1',
    clientTypes: ['DSP'],
    canBeSharedWith: true,
  },
};
