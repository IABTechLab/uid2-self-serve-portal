import { Meta } from '@storybook/react';
import { useState } from 'react';

import { UserRole } from '../../../api/entities/User';
import TeamMemberDialog from './TeamMemberDialog';

export default {
  title: 'Team Member/Team Member Dialog',
  component: TeamMemberDialog,
} as Meta<typeof TeamMemberDialog>;

export const Default = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <TeamMemberDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          onAddTeamMember={(form) =>
            Promise.resolve(console.log(`Add new user ${JSON.stringify(form)}`))
          }
        />
      )}
    </div>
  );
};

export const WithTeamMember = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <TeamMemberDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          onUpdateTeamMember={(form) =>
            Promise.resolve(console.log(`Add new user ${JSON.stringify(form)}`))
          }
          person={{
            id: 1,
            email: 'test@user.com',
            firstName: 'test',
            lastName: 'test',
            role: UserRole.DA,
            acceptedTerms: true,
            participantId: 1,
          }}
        />
      )}
    </div>
  );
};
