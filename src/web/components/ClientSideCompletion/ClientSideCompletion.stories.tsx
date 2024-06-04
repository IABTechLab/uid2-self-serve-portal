import { faker } from '@faker-js/faker';
import type { Meta, StoryObj } from '@storybook/react';

import { ClientSideCompletion } from './ClientSideCompletion';

function createKeypairFake(disabled: boolean) {
  return {
    created: faker.date.recent(),
    createdString: faker.date.recent().toLocaleTimeString(),
    disabled,
    publicKey: faker.string.hexadecimal(),
    siteId: faker.number.int(),
    subscriptionId: faker.string.alpha(),
  };
}

const meta: Meta<typeof ClientSideCompletion> = {
  title: 'CSTG/Client Side Completion',
  component: ClientSideCompletion,
};

export default meta;
type Story = StoryObj<typeof ClientSideCompletion>;

export const ReadyToCSTG: Story = {
  args: {
    domainNames: ['example.com'],
    keyPairData: [createKeypairFake(false)],
  },
  name: 'Ready to CSTG (renders empty - nothing to say!)',
};

export const NoDomains: Story = {
  args: {
    domainNames: [],
    keyPairData: [createKeypairFake(false)],
  },
};

export const KeypairButItsDisabled: Story = {
  args: {
    domainNames: ['example.com'],
    keyPairData: [createKeypairFake(true)],
  },
};

export const NoKeyPairs: Story = {
  args: {
    domainNames: ['example.com'],
    keyPairData: [],
  },
};

export const NothingConfigured: Story = {
  args: {
    domainNames: [],
    keyPairData: [],
  },
};
