import { Meta, StoryObj } from '@storybook/react-webpack5';

import { ErrorToast, InfoToast, SuccessToast, ToastContainerWrapper, WarningToast } from './Toast';

function TestToast() {
  return (
    <>
      <ToastContainerWrapper />
      <div>
        <button
          type='button'
          onClick={() => {
            SuccessToast('Success!');
          }}
        >
          Success
        </button>
        <button
          type='button'
          onClick={() => {
            InfoToast('Info!');
          }}
        >
          Info
        </button>
        <button
          type='button'
          onClick={() => {
            WarningToast('Warning!');
          }}
        >
          Warning
        </button>
        <button
          type='button'
          onClick={() => {
            ErrorToast('Error!');
          }}
        >
          Error
        </button>
      </div>
    </>
  );
}

const meta: Meta<typeof TestToast> = {
  component: TestToast,
  title: 'Shared Components/ Toast',
};

export default meta;
type Story = StoryObj<typeof TestToast>;

export const Default: Story = {};
