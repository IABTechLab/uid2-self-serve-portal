import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PortalRoute } from './routeTypes';

import './teamMembers.scss';

type Person = {
  name: string;
  role: string;
  email: string;
};
type TeamMemberProps = { person: Person };
function TeamMember({ person }: TeamMemberProps) {
  return (
    <>
      <div className='name'>{person.name}</div>
      <div className='role'>{person.role}</div>
      <div className='email'>{person.email}</div>
      <div className='action'>
        <FontAwesomeIcon icon='ellipsis-h' />
      </div>
    </>
  );
}

function TeamMembers() {
  const team = [
    {
      name: 'Alison Morris',
      role: 'SRE',
      email: 'alison.morris@thetradedesk.com',
    },
    {
      name: 'Lionell Pack',
      role: 'Front-end Engineer',
      email: 'lionell.pack@thetradedesk.com',
    },
  ];
  return (
    <div className='portal-team'>
      <div className='add-team-member'>+ Add team member</div>
      <div className='portal-team-table'>
        <div className='name header-item'>Team Member</div>
        <div className='role header-item'>Role</div>
        <div className='email header-item'>Email</div>
        <div className='action header-item'>Action</div>
        {team.map((t) => (
          <TeamMember key={t.email} person={t} />
        ))}
      </div>
    </div>
  );
}

export const TeamMembersRoute: PortalRoute = {
  description: 'Team Members',
  element: <TeamMembers />,
  path: '/team',
};
