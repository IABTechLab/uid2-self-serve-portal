import type { Meta, StoryObj } from '@storybook/react';

import KeyCreationDialog from './KeyCreationDialog';

const meta: Meta<typeof KeyCreationDialog> = {
  component: KeyCreationDialog,
  title: 'Api Management/Key Creation Dialog',
};
export default meta;

type Story = StoryObj<typeof KeyCreationDialog>;

export const MultipleRoles: Story = {
  args: {
    triggerButton: <button type='button'>Open</button>,
    onKeyCreation: (form) => {
      console.log(`Add a new Key ${JSON.stringify(form)}`);
      return Promise.resolve({
        plaintextKey: 'Test_Plaintext',
        secret: 'Test_Secret',
        name: 'Test_Key',
      });
    },
    availableRoles: [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 3 },
    ],
  },
};

export const OneRole: Story = {
  args: {
    triggerButton: <button type='button'>Open</button>,
    onKeyCreation: (form) => {
      console.log(`Add a new Key ${JSON.stringify(form)}`);
      return Promise.resolve({
        plaintextKey: 'Test_Plaintext',
        secret: 'Test_Secret',
        name: 'Test_Key',
      });
    },
    availableRoles: [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 }],
  },
};
