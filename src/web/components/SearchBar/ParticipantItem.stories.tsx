import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { ParticipantItem } from './ParticipantItem';

export default {
  title: 'Search bar/ParticipantItem',
  component: ParticipantItem,
} as ComponentMeta<typeof ParticipantItem>;

const Template: ComponentStory<typeof ParticipantItem> = (args) => <ParticipantItem {...args} />;

export const Checked = Template.bind({});
Checked.args = {
  participant: {
    id: 1,
    name: 'Participant 1',
    types: [{ id: 2, typeName: 'Type 2' }],
    status: ParticipantStatus.Approved,
  },
  onClick: () => {},
  checked: true,
};

export const Unchecked = Template.bind({});
Unchecked.args = {
  participant: {
    id: 2,
    name: 'Participant 2',
    types: [
      { id: 3, typeName: 'Type 3' },
      { id: 4, typeName: 'Type 4' },
    ],
    status: ParticipantStatus.Approved,
  },
  onClick: () => {},
  checked: false,
};
