// export {};
// import {
//   InviteTeamMemberForm,
//   UpdateTeamMemberForm,
//   UserResponse,
// } from '../../services/userAccount';
import KeyPair from './KeyPair';
import { KeyPairModel } from './KeyPairModel';

// import TeamMemberDialog from './TeamMemberDialog';
import './KeyPairsTable.scss';

type KeyPairTableProps = {
  keyPairs: KeyPairModel[];
  // onAddTeamMember: (form: InviteTeamMemberForm) => Promise<void>;
  // onRemoveTeamMember: (id: number) => Promise<void>;
  // onUpdateTeamMember: (id: number, form: UpdateTeamMemberForm) => Promise<void>;
  // resendInvite: (id: number) => Promise<void>;
};
// contact?: string;
// created: Date;
// disabled: boolean;
// public_key: string;
// site_id: number;
// subscription_id: string;

function KeyPairsTable({
  keyPairs,
}: // onAddTeamMember,
// resendInvite,
// onRemoveTeamMember,
// onUpdateTeamMember,
KeyPairTableProps) {
  return (
    <div className='key-pairs'>
      <table className='key-pairs-table'>
        <thead>
          <tr>
            <th className='subscription-id'>Subscription Id</th>
            <th className='site-id'>Site Id</th>
            <th className='public-key'>Public Key</th>
            <th className='created'>Created</th>
            <th className='actions'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keyPairs.map((k) => (
            <KeyPair
              key={k.publicKey}
              keyPair={k}
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
