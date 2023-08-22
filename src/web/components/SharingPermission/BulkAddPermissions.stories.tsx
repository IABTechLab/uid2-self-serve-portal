import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { BulkAddPermissions } from './BulkAddPermissions';

export default {
  title: 'Sharing Permissions/BulkAddPermissions',
  component: BulkAddPermissions,
} as ComponentMeta<typeof BulkAddPermissions>;

const Template: ComponentStory<typeof BulkAddPermissions> = (args) => (
  <BulkAddPermissions {...args} />
);

const onBulkAddSharingPermission = (types: string[]) => Promise.resolve(console.log(types));

export const Publisher = Template.bind({});
Publisher.args = {
  participant: {
    id: 1,
    name: 'Participant 1',
    types: [{ id: 2, typeName: 'Publisher' }],
    allowSharing: true,
    status: ParticipantStatus.Approved,
  },
  onBulkAddSharingPermission,
  sharedTypes: [],
};

export const AdvertiserAndDSP = Template.bind({});
AdvertiserAndDSP.args = {
  participant: {
    id: 1,
    name: 'Participant 1',
    types: [
      { id: 3, typeName: 'Advertiser' },
      { id: 4, typeName: 'DSP' },
    ],
    allowSharing: true,
    status: ParticipantStatus.Approved,
  },
  onBulkAddSharingPermission,
  sharedTypes: [],
};

export const AllTypes = Template.bind({});
AllTypes.args = {
  participant: {
    id: 1,
    name: 'Participant 1',
    types: [
      { id: 2, typeName: 'Publisher' },
      { id: 3, typeName: 'Advertiser' },
      { id: 4, typeName: 'DSP' },
      { id: 5, typeName: 'Data Provider' },
    ],
    allowSharing: true,
    status: ParticipantStatus.Approved,
  },
  onBulkAddSharingPermission,
  sharedTypes: [],
};

export const HasSharedWithPublisher = Template.bind({});
HasSharedWithPublisher.args = {
  participant: {
    id: 1,
    name: 'Participant 1',
    types: [
      { id: 2, typeName: 'Publisher' },
      { id: 3, typeName: 'Advertiser' },
      { id: 4, typeName: 'DSP' },
    ],
    allowSharing: true,
    status: ParticipantStatus.Approved,
  },
  onBulkAddSharingPermission,
  hasSharingParticipants: true,
  sharedTypes: ['publisher'],
};
