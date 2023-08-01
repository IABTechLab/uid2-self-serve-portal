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

const onBulkAddSharingPermission = (ids: number[]) => Promise.resolve(console.log(ids));

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
  participantTypes: [
    { id: 2, typeName: 'Publisher' },
    { id: 3, typeName: 'Advertiser' },
    { id: 4, typeName: 'DSP' },
    { id: 5, typeName: 'Data Provider' },
  ],
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
  participantTypes: [
    { id: 2, typeName: 'Publisher' },
    { id: 3, typeName: 'Advertiser' },
    { id: 4, typeName: 'DSP' },
    { id: 5, typeName: 'Data Provider' },
  ],
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
  participantTypes: [
    { id: 2, typeName: 'Publisher' },
    { id: 3, typeName: 'Advertiser' },
    { id: 4, typeName: 'DSP' },
    { id: 5, typeName: 'Data Provider' },
  ],
};

export const HasSharingParticipants = Template.bind({});
HasSharingParticipants.args = {
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
  participantTypes: [
    { id: 2, typeName: 'Publisher' },
    { id: 3, typeName: 'Advertiser' },
    { id: 4, typeName: 'DSP' },
    { id: 5, typeName: 'Data Provider' },
  ],
  hasSharingParticipants: true,
};
