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

export const KeyPairAndDomainNames: Story = {
  args: {
    domainNames: ['example.com'],
    keyPairData: [createKeypairFake(false)],
  },
  name: 'Key Pair and Domain Names (renders empty - nothing to say!)',
};

export const KeyPairAndAppIds: Story = {
  args: {
    appIds: ['123456789'],
    keyPairData: [createKeypairFake(false)],
  },
  name: 'Key Pair and App IDs (renders empty - nothing to say!)',
};

export const KeyPairOnly: Story = {
  args: {
    keyPairData: [createKeypairFake(false)],
  },
};

export const DomainNameAndDisabledKeypair: Story = {
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
