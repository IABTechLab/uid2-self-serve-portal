// export {};
// import {
//   InviteTeamMemberForm,
//   UpdateTeamMemberForm,
//   UserResponse,
// } from '../../services/userAccount';
import { KeyPairResponse } from '../../services/keyPairsServices';
import KeyPair from './KeyPair';

// import TeamMemberDialog from './TeamMemberDialog';
import './KeyPairTable.scss';

type KeyPairTableProps = {
  keyPairs: KeyPairResponse;
  // onAddTeamMember: (form: InviteTeamMemberForm) => Promise<void>;
  // onRemoveTeamMember: (id: number) => Promise<void>;
  // onUpdateTeamMember: (id: number, form: UpdateTeamMemberForm) => Promise<void>;
  // resendInvite: (id: number) => Promise<void>;
};

function KeyPairsTable({
  keyPairs,
}: // onAddTeamMember,
// resendInvite,
// onRemoveTeamMember,
// onUpdateTeamMember,
KeyPairTableProps) {
  return (
    <div className='portal-team'>
      <table className='portal-team-table'>
        <thead>
          <tr>
            <th className='name'>Name</th>
            <th className='email'>Email</th>
            <th className='jobFunction'>Job Function</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keyPairs.map((t) => (
            <KeyPair
            // key={t.email}
            // person={t}
            // resendInvite={resendInvite}
            // onRemoveTeamMember={onRemoveTeamMember}
            // onUpdateTeamMember={onUpdateTeamMember}
            />
          ))}
        </tbody>
      </table>
      {/* <div className='add-team-member'>
        <TeamMemberDialog
          onAddTeamMember={onAddTeamMember}
          triggerButton={
            <button className='small-button' type='button'>
              Add team member
            </button>
          }
        />
      </div> */}
    </div>
  );
}

export default KeyPairsTable;
