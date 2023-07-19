import { useContext } from 'react';

import { ParticipantStatus } from '../../api/entities/Participant';
import { Notification } from '../components/Core/Notification';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { PortalRoute } from './routeUtils';

import './accountPending.scss';

const awaitingApproval = (
  <p>
    Thank you! We’ve sent a confirmation message to the email you gave us. Please verify and then
    we’ll review your request.
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
    <Notification
      icon={['far', 'circle-check']}
      title={
        <>
          {title}
          <div className='pending-label'>Account Pending</div>
        </>
      }
      notification={
        participant?.status === ParticipantStatus.AwaitingSigning
          ? awaitingSigning
          : awaitingApproval
      }
      className='account-pending-content'
    />
  );
}

export const AccountPendingRoute: PortalRoute = {
  path: '/account/pending',
  element: <AccountPending />,
  description: 'Account pending',
};
