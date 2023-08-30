import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Middleware, SWRConfig, SWRHook } from 'swr';

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
    roles: ['SHARER'],
    // eslint-disable-next-line camelcase
    client_count: 1,
  },
  {
    id: 4,
    name: 'Test Four',
    enabled: true,
    roles: ['SHARER'],
    // eslint-disable-next-line camelcase
    client_count: 1,
  },
];

const Template: ComponentStory<typeof ParticipantApprovalForm> = (args) => {
  return (
    <TestSiteListProvider response={response}>
      <ParticipantApprovalForm {...args} />
    </TestSiteListProvider>
  );
};

export const ParticipantApproval = Template.bind({});
ParticipantApproval.args = {
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
  onApprove: async (form) => {
    console.log(JSON.stringify(form));
  },
};
