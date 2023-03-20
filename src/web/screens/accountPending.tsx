import { CheckCircledIcon } from '@radix-ui/react-icons';
import { useContext } from 'react';

import { ParticipantStatus } from '../../api/entities/Participant';
import { Notification } from '../components/Core/Notification';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { PortalRoute } from './routeUtils';

import './accountPending.scss';

const awaitingApproval = (
  <p>
    You’re all set to go. please give our team up to 3 business days to review your request and get
    you set up. You’ll receive an email once your account is ready to go. <br />
    <br />
    Please be on the look out. Please understand that we cannot begin to process your request until
    we have a signed contract and agreement to terms.
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
      Icon={CheckCircledIcon}
      title={title}
      notification={
        participant?.status === ParticipantStatus.AwaitingSigning
          ? awaitingSigning
          : awaitingApproval
      }
      className='accountPendingContent'
    />
  );
}

export const AccountPendingRoute: PortalRoute = {
  path: '/account/pending',
  element: <AccountPending />,
  description: 'Account pending',
};
