import { Meta, StoryObj } from '@storybook/react';

import { ErrorToast, InfoToast, SuccessToast, ToastContainerWrapper, WarningToast } from './Toast';

function TestToast() {
  return (
    <>
      <ToastContainerWrapper />
      <div>
        <button
          type='button'
          onClick={() => {
            SuccessToast(
              'Your key has been updated fdasfdasfsdafsadf fdasf sdafasdw fda fasdf asdfasd ff'
            );
          }}
        >
          Success
        </button>
        <button
          type='button'
          onClick={() => {
            InfoToast('TESTING');
          }}
        >
          Info
        </button>
        <button
          type='button'
          onClick={() => {
            WarningToast('TESTING');
          }}
        >
          Warning
        </button>
        <button
          type='button'
          onClick={() => {
            ErrorToast('TESTING');
          }}
        >
          Error
        </button>
      </div>
    </>
  );
}

export default {
  component: TestToast,
  title: 'Shared Components/ Toast',
} as Meta<typeof TestToast>;

type Story = StoryObj<typeof TestToast>;

export const Default: Story = {};
