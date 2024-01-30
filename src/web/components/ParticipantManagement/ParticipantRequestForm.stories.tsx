import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { UserRole } from '../../../api/entities/User';
import { AdminSiteDTO } from '../../../api/services/adminServiceHelpers';
import { TestSiteListProvider } from '../../services/site';
import ParticipantApprovalForm from './ParticipantApprovalForm';

export default {
  title: 'Manage Participants/ParticipantApprovalForm',
  component: ParticipantApprovalForm,
} as ComponentMeta<typeof ParticipantApprovalForm>;

const response: AdminSiteDTO[] = [
  {
    id: 2,
    name: 'Test Site',
    enabled: true,
    roles: ['SHARER'],
    clientTypes: ['PUBLISHER'],
    // eslint-disable-next-line camelcase
    client_count: 1,
    visible: true,
  },
  {
    id: 4,
    name: 'Test Four',
    enabled: true,
    roles: ['SHARER'],
    clientTypes: ['PUBLISHER'],
    // eslint-disable-next-line camelcase
    client_count: 1,
    visible: false,
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
    { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
    { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
    { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
    { id: 4, roleName: 'SHARER', externalName: 'Sharer' },
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
    { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
    { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
    { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
    { id: 4, roleName: 'SHARER', externalName: 'Sharer' },
  ],
  onApprove: async (form) => {
    console.log(JSON.stringify(form));
  },
};
