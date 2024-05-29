import { Meta, StoryFn, StoryObj } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { SharingSiteDTO } from '../../../api/helpers/siteConvertingHelpers';
import { TestAvailableSiteListProvider } from '../../services/site';
import { BulkAddPermissions } from './BulkAddPermissions';

const meta: Meta<typeof BulkAddPermissions> = {
  title: 'Sharing Permissions/Bulk Add Permissions',
  component: BulkAddPermissions,
};

export default meta;

const response: SharingSiteDTO[] = [
  {
    id: 1,
    name: 'Test Publisher',
    clientTypes: ['PUBLISHER'],
    canBeSharedWith: true,
  },
  {
    id: 2,
    name: 'Test Advertiser',
    clientTypes: ['ADVERTISER'],
    canBeSharedWith: true,
  },
  {
    id: 3,
    name: 'Test DSP',
    clientTypes: ['DSP'],
    canBeSharedWith: true,
  },
  {
    id: 4,
    name: 'Test Data Provider',
    clientTypes: ['DATA_PROVIDER'],
    canBeSharedWith: true,
  },
  {
    id: 5,
    name: 'Test with all types',
    clientTypes: ['PUBLISHER', 'ADVERTISER', 'DSP', 'DATA_PROVIDER'],
    canBeSharedWith: true,
  },
];

const Template: StoryFn<typeof BulkAddPermissions> = (args) => (
  <TestAvailableSiteListProvider response={response}>
    <BulkAddPermissions {...args} />
  </TestAvailableSiteListProvider>
);

type Story = StoryObj<typeof BulkAddPermissions>;

const onBulkAddSharingPermission = (types: string[]) => Promise.resolve(console.log(types));

export const Publisher: Story = {
  render: Template,

  args: {
    participant: {
      id: 1,
      name: 'Participant 1',
      types: [{ id: 2, typeName: 'Publisher' }],
      allowSharing: true,
      status: ParticipantStatus.Approved,
      completedRecommendations: false,
      crmAgreementNumber: '12345678',
    },
    onBulkAddSharingPermission,
    sharedTypes: [],
  },
};

export const AdvertiserAndDSP: Story = {
  render: Template,

  args: {
    participant: {
      id: 1,
      name: 'Participant 1',
      types: [
        { id: 3, typeName: 'Advertiser' },
        { id: 1, typeName: 'DSP' },
      ],
      allowSharing: true,
      status: ParticipantStatus.Approved,
      completedRecommendations: false,
      crmAgreementNumber: '23456789',
    },
    onBulkAddSharingPermission,
    sharedTypes: [],
  },
};

export const AllTypes: Story = {
  render: Template,

  args: {
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
      completedRecommendations: false,
      crmAgreementNumber: '34567890',
    },
    onBulkAddSharingPermission,
    sharedTypes: [],
  },
};

export const HasSharedWithPublisher: Story = {
  render: Template,

  args: {
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
      completedRecommendations: true,
      crmAgreementNumber: '45678901',
    },
    onBulkAddSharingPermission,
    sharedTypes: ['PUBLISHER'],
  },
};
