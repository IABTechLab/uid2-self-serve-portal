import type { Meta } from '@storybook/react';
import { useState } from 'react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { UserRole } from '../../../api/entities/User';
import EditParticipantDialog from './EditParticipantDialog';

const meta: Meta<typeof EditParticipantDialog> = {
  component: EditParticipantDialog,
  title: 'Manage Participants/Edit Participant Dialog',
};
export default meta;

const apiRoles = [
  { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
  { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
  { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
  { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
];

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
  apiRoles: apiRoles.slice(0, 3),
  status: ParticipantStatus.Approved,
  allowSharing: true,
  completedRecommendations: false,
  crmAgreementNumber: '12345678',
  users: [
    {
      id: 4,
      email: 'test5@example.com',
      firstName: 'First Test User 5',
      lastName: 'Last Test User 5',
      role: UserRole.Marketing,
      acceptedTerms: false,
    },
  ],
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
          apiRoles={apiRoles}
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
          apiRoles={apiRoles}
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
