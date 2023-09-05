import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantItemSimple } from './ParticipantItem';

export default {
  title: 'Sharing Permissions/ParticipantItemSimple',
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
  participant: {
    siteId: 1,
    name: 'Participant 1',
    types: [{ id: 2, typeName: 'Type 2' }],
  },
};
