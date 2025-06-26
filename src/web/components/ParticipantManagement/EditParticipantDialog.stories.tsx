import type { Meta } from '@storybook/react-webpack5';
import { useState } from 'react';

import { UserJobFunction } from '../../../api/entities/User';
import { allApiRoles } from '../ApiKeyManagement/KeyHelper';
import EditParticipantDialog from './EditParticipantDialog';

const meta: Meta<typeof EditParticipantDialog> = {
  component: EditParticipantDialog,
  title: 'Manage Participants/Edit Participant Dialog',
};
export default meta;

const participantTypes = [
  { id: 1, typeName: 'DSP' },
  { id: 2, typeName: 'Advertiser' },
  { id: 3, typeName: 'Data Provider' },
  { id: 4, typeName: 'Publisher' },
];

const participant = {
  id: 5,
  name: 'Participant 5',
  types: [
    { id: 1, typeName: 'Type 1' },
    { id: 2, typeName: 'Type 2' },
    { id: 3, typeName: 'Type 3' },
    { id: 4, typeName: 'Type 4' },
  ],
  apiRoles: allApiRoles.slice(0, 3),
  allowSharing: true,
  completedRecommendations: false,
  crmAgreementNumber: '12345678',
  users: [
    {
      id: 4,
      email: 'test5@example.com',
      firstName: 'First Test User 5',
      lastName: 'Last Test User 5',
      jobFunction: UserJobFunction.Marketing,
      acceptedTerms: false,
    },
  ],
  siteId: 123,
};

export const ParticipantWithExistingRoles = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <EditParticipantDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          apiRoles={allApiRoles}
          participantTypes={participantTypes}
          participant={participant}
          onEditParticipant={(form) => {
            return Promise.resolve(console.log(`Participant edited: ${JSON.stringify(form)}`));
          }}
        />
      )}
    </div>
  );
};

export const ParticipantWithNoRolesOrTypes = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <EditParticipantDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          apiRoles={allApiRoles}
          participantTypes={participantTypes}
          participant={{ ...participant, apiRoles: [], types: [] }}
          onEditParticipant={(form) => {
            return Promise.resolve(console.log(`Participant edited: ${JSON.stringify(form)}`));
          }}
        />
      )}
    </div>
  );
};
