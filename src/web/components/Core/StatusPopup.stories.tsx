import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { StatusPopup } from './StatusPopup';

export default {
  title: 'Shared Components/StatusPopup',
  component: StatusPopup,
} as ComponentMeta<typeof StatusPopup>;

const Template: ComponentStory<typeof StatusPopup> = (args) => {
  const [showStatusPopup, setShowStatusPopup] = useState(true);

  return <StatusPopup {...args} show={showStatusPopup} setShow={setShowStatusPopup} />;
};
export const Success = Template.bind({});
Success.args = {
  message: 'Success! Your action was successful.',
  status: 'Success',
};

export const Error = Template.bind({});
Error.args = {
  message: 'Error! Something went wrong.',
  status: 'Error',
};

export const Info = Template.bind({});
Info.args = {
  message: 'Info! This is some information.',
  status: 'Info',
};
