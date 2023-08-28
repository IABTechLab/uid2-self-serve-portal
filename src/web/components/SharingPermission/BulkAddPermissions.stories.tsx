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

const availableParticipants = [
  {
    id: 1,
    siteId: 1,
    name: 'Participant 1',
    types: [{ id: 1, typeName: 'DSP' }],
  },
  {
    id: 2,
    siteId: 2,
    name: 'Participant 2',
    types: [{ id: 2, typeName: 'Publisher' }],
  },
  {
    id: 3,
    siteId: 3,
    name: 'Participant 3',
    types: [{ id: 3, typeName: 'Advertiser' }],
  },
  {
    id: 4,
    siteId: 4,
    name: 'Participant 4',
    types: [{ id: 4, typeName: 'Data Provider' }],
  },
  {
    id: 5,
    siteId: 5,
    name: 'Participant 5',
    types: [
      { id: 1, typeName: 'DSP' },
      { id: 2, typeName: 'Publisher' },
      { id: 3, typeName: 'Advertiser' },
      { id: 4, typeName: 'Data Provider' },
    ],
  },
  {
    id: 6,
    siteId: 6,
    name: 'Participant 6',
    types: [{ id: 6, typeName: 'DSP' }],
  },
  {
    id: 7,
    siteId: 7,
    name: 'Participant 7',
    types: [{ id: 7, typeName: 'Publisher' }],
  },
  {
    id: 8,
    siteId: 8,
    name: 'Participant 8',
    types: [{ id: 8, typeName: 'Advertiser' }],
  },
  {
    id: 9,
    siteId: 9,
    name: 'Participant 9',
    types: [{ id: 9, typeName: 'Data Provider' }],
  },
  {
    id: 10,
    siteId: 10,
    name: 'Participant 10',
    types: [
      { id: 1, typeName: 'DSP' },
      { id: 2, typeName: 'Publisher' },
      { id: 3, typeName: 'Advertiser' },
      { id: 4, typeName: 'Data Provider' },
    ],
  },
  {
    id: 11,
    siteId: 11,
    name: 'Participant 11',
    types: [{ id: 11, typeName: 'DSP' }],
  },
  {
    id: 12,
    siteId: 12,
    name: 'Participant 12',
    types: [{ id: 12, typeName: 'Publisher' }],
  },
  {
    id: 13,
    siteId: 13,
    name: 'Participant 13',
    types: [{ id: 13, typeName: 'Advertiser' }],
  },
  {
    id: 14,
    siteId: 14,
    name: 'Participant 14',
    types: [{ id: 14, typeName: 'Data Provider' }],
  },
  {
    id: 15,
    siteId: 15,
    name: 'Participant 15',
    types: [
      { id: 1, typeName: 'DSP' },
      { id: 2, typeName: 'Publisher' },
      { id: 3, typeName: 'Advertiser' },
      { id: 4, typeName: 'Data Provider' },
    ],
  },
];

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
  availableParticipants,
};

export const AdvertiserAndDSP = Template.bind({});
AdvertiserAndDSP.args = {
  participant: {
    id: 1,
    name: 'Participant 1',
    types: [
      { id: 3, typeName: 'Advertiser' },
      { id: 1, typeName: 'DSP' },
    ],
    allowSharing: true,
    status: ParticipantStatus.Approved,
  },
  onBulkAddSharingPermission,
  sharedTypes: [],
  availableParticipants,
};

export const AllTypes = Template.bind({});
AllTypes.args = {
  participant: {
    id: 1,
    name: 'Participant 1',
    types: [
      { id: 2, typeName: 'Publisher' },
      { id: 3, typeName: 'Advertiser' },
      { id: 1, typeName: 'DSP' },
      { id: 4, typeName: 'Data Provider' },
    ],
    allowSharing: true,
    status: ParticipantStatus.Approved,
  },
  onBulkAddSharingPermission,
  sharedTypes: [],
  availableParticipants,
};

export const HasSharedWithPublisher = Template.bind({});
HasSharedWithPublisher.args = {
  participant: {
    id: 1,
    name: 'Participant 1',
    types: [
      { id: 2, typeName: 'Publisher' },
      { id: 3, typeName: 'Advertiser' },
      { id: 1, typeName: 'DSP' },
    ],
    allowSharing: true,
    status: ParticipantStatus.Approved,
  },
  onBulkAddSharingPermission,
  hasSharingParticipants: true,
  sharedTypes: ['publisher'],
  availableParticipants,
};
