import { Meta } from '@storybook/react';
import { useState } from 'react';

import { UserJobFunction } from '../../../api/entities/User';
import TeamMemberDialog from './TeamMemberDialog';

const meta: Meta<typeof TeamMemberDialog> = {
  title: 'Team Member/Team Member Dialog',
  component: TeamMemberDialog,
};

export default meta;

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
          teamMembers={[]}
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
            jobFunction: UserJobFunction.DA,
            acceptedTerms: true,
            isUid2Support: false,
            isSuperUser: false,
          }}
          teamMembers={[]}
        />
      )}
    </div>
  );
};
