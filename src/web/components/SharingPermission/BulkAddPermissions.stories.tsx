import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { TestAvailableSiteListProvider } from '../../services/site';
import { BulkAddPermissions } from './BulkAddPermissions';

export default {
  title: 'Sharing Permissions/BulkAddPermissions',
  component: BulkAddPermissions,
} as ComponentMeta<typeof BulkAddPermissions>;

const response: AvailableParticipantDTO[] = [
  {
    siteId: 1,
    name: 'Test Publisher',
    types: [{ id: 4, typeName: 'Publisher' }],
  },
  {
    siteId: 2,
    name: 'Test Advertiser',
    types: [{ id: 2, typeName: 'Advertiser' }],
  },
  {
    siteId: 3,
    name: 'Test DSP',
    types: [{ id: 1, typeName: 'DSP' }],
  },
  {
    siteId: 4,
    name: 'Test Data Provider',
    types: [{ id: 3, typeName: 'Data Provider' }],
  },
  {
    siteId: 5,
    name: 'Test with all types',
    types: [
      { id: 4, typeName: 'Publisher' },
      { id: 2, typeName: 'Advertiser' },
      { id: 1, typeName: 'DSP' },
      { id: 3, typeName: 'Data Provider' },
    ],
  },
];

const Template: ComponentStory<typeof BulkAddPermissions> = (args) => (
  <TestAvailableSiteListProvider response={response}>
    <BulkAddPermissions {...args} />
  </TestAvailableSiteListProvider>
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
    completedRecommendationsWorkflow: false,
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
      { id: 1, typeName: 'DSP' },
    ],
    allowSharing: true,
    status: ParticipantStatus.Approved,
    completedRecommendationsWorkflow: false,
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
      { id: 1, typeName: 'DSP' },
      { id: 4, typeName: 'Data Provider' },
    ],
    allowSharing: true,
    status: ParticipantStatus.Approved,
    completedRecommendationsWorkflow: false,
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
      { id: 1, typeName: 'DSP' },
    ],
    allowSharing: true,
    status: ParticipantStatus.Approved,
    completedRecommendationsWorkflow: true,
  },
  onBulkAddSharingPermission,
  sharedTypes: ['PUBLISHER'],
};
