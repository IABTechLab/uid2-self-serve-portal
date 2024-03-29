/* eslint-disable camelcase */
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { UserRole } from '../../../api/entities/User';
import { SiteDTO } from '../../../api/services/adminServiceHelpers';
import { TestSiteListProvider } from '../../services/site';
import ParticipantApprovalForm from './ParticipantApprovalForm';

export default {
  title: 'Manage Participants/ParticipantApprovalForm',
  component: ParticipantApprovalForm,
} as ComponentMeta<typeof ParticipantApprovalForm>;

const response: SiteDTO[] = [
  {
    id: 2,
    name: 'Test Site',
    enabled: true,
    apiRoles: [
      { id: 1, roleName: 'Role1', externalName: 'Role 1', order: 1 },
      { id: 2, roleName: 'Role2', externalName: 'Role 2', order: 2 },
    ],
    clientTypes: ['PUBLISHER'],
    client_count: 1,
    visible: true,
    domain_names: [],
  },
  {
    id: 4,
    name: 'Test Four',
    enabled: true,
    apiRoles: [{ id: 1, roleName: 'Role1', externalName: 'Role 1', order: 1 }],
    clientTypes: ['PUBLISHER'],
    client_count: 1,
    visible: false,
    domain_names: [],
  },
];

const Template: ComponentStory<typeof ParticipantApprovalForm> = (args) => {
  return (
    <TestSiteListProvider response={response}>
      <ParticipantApprovalForm {...args} />
    </TestSiteListProvider>
  );
};

export const ParticipantApprovalMatchingSite = Template.bind({});
ParticipantApprovalMatchingSite.args = {
  participant: {
    id: 1,
    name: 'Test Participant',
    types: [
      { id: 1, typeName: 'Type 1' },
      { id: 2, typeName: 'Type 2' },
    ],
    status: ParticipantStatus.AwaitingApproval,
    requestingUser: {
      email: 'test@example.com',
      fullName: 'Test User',
      role: UserRole.MediaBuyer,
    },
  },
  participantTypes: [
    { id: 1, typeName: 'Type 1' },
    { id: 2, typeName: 'Type 2' },
    { id: 3, typeName: 'Type 3' },
  ],
  apiRoles: [
    { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
    { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
    { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
    { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
  ],
  onApprove: async (form) => {
    console.log(JSON.stringify(form));
  },
};

export const ParticipantApprovalSiteSearch = Template.bind({});
ParticipantApprovalSiteSearch.args = {
  participant: {
    id: 1,
    name: 'Participant 1',
    types: [
      { id: 1, typeName: 'Type 1' },
      { id: 2, typeName: 'Type 2' },
    ],
    status: ParticipantStatus.AwaitingApproval,
    requestingUser: {
      email: 'test@example.com',
      fullName: 'Test User',
      role: UserRole.MediaBuyer,
    },
  },
  participantTypes: [
    { id: 1, typeName: 'Type 1' },
    { id: 2, typeName: 'Type 2' },
    { id: 3, typeName: 'Type 3' },
  ],
  apiRoles: [
    { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
    { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
    { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
    { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
  ],
  onApprove: async (form) => {
    console.log(JSON.stringify(form));
  },
};
