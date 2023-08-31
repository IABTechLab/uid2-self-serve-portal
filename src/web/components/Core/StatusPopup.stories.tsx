import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { StatusPopup, StatusPopupProps } from './StatusPopup';

export default {
  title: 'Shared Components/StatusPopup',
  component: StatusPopup,
} as ComponentMeta<typeof StatusPopup>;

const Template: ComponentStory<typeof StatusPopup> = (args: StatusPopupProps) => {
  const [showStatusPopup, setShowStatusPopup] = useState(true);

  return <StatusPopup {...args} show={showStatusPopup} setShow={setShowStatusPopup} />;
};

export const Success = Template.bind({});
Success.args = {
  message: 'Success! Your action was successful.',
  status: 'Success',
  displayDuration: 100000,
};

export const Error = Template.bind({});
Error.args = {
  message: 'Error! Something went wrong.',
  status: 'Error',
  displayDuration: 100000,
};

export const Info = Template.bind({});
Info.args = {
  message: 'Info! This is some information.',
  status: 'Info',
  displayDuration: 100000,
};

export const Warning = Template.bind({});
Warning.args = {
  message: 'Warning! This is a warning.',
  status: 'Warning',
  displayDuration: 100000,
};
