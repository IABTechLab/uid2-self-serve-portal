import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Banner } from './Banner';

export default {
  title: 'Shared Components/Banner',
  component: Banner,
} as ComponentMeta<typeof Banner>;

const Template: ComponentStory<typeof Banner> = (args) => <Banner {...args} />;

export const WithInfoMessage = Template.bind({});
WithInfoMessage.args = {
  message: 'here is a banner',
};
