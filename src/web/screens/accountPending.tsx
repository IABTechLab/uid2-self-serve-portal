import { useContext } from 'react';

import { ParticipantStatus } from '../../api/entities/Participant';
import { Notification } from '../components/Core/Notification';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { PortalRoute } from './routeUtils';

import './accountPending.scss';

const awaitingApproval = (
  <p>
    Thank you! We&apos;ve sent your account request for approval. As soon as it&apos;s approved,
    we&apos;ll send you a confirmation email.
  </p>
);

const awaitingSigning = (
  <p>
    Once the contract is signed by the person you appointed we will work to get you access to UID.
    Please understand that we cannot begin to process your request until we have a signed contract
    and agreement to terms. <br />
    <br />
    <b>
      An email has been sent to e.tacoma@shredders.com to create an account and sign the contract.
    </b>
  </p>
);
function AccountPending() {
  const { participant } = useContext(ParticipantContext);
  const title =
    participant?.status === ParticipantStatus.AwaitingSigning
      ? 'Access Pending'
      : 'Access Requested!';
  return (
    <div className='app-panel'>
      <Notification
        icon={['far', 'circle-check']}
        title={
          <div className='account-pending--header'>
            {title}
            <div className='pending-label'>Account Pending</div>
          </div>
        }
        notification={
          participant?.status === ParticipantStatus.AwaitingSigning
            ? awaitingSigning
            : awaitingApproval
        }
        className='account-pending-content'
      />
    </div>
  );
}

export const AccountPendingRoute: PortalRoute = {
  path: '/account/pending',
  element: <AccountPending />,
  description: 'Account pending',
};
