import { CheckCircledIcon } from '@radix-ui/react-icons';
import { useContext } from 'react';

import { ParticipantStatus } from '../../api/entities/Participant';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { PortalRoute } from './routeTypes';

import './accountPending.scss';

const awaitingApproval = (
  <div>
    <h1 className='accountPendingHeader'>Access Requested!</h1>
    <p>
      You’re all set to go. please give our team up to 3 business days to review your request and
      get you set up. You’ll receive an email once your account is ready to go. <br />
      <br />
      Please be on the look out. Please understand that we cannot begin to process your request
      until we have a signed contract and agreement to terms.
    </p>
  </div>
);

const awaitingSigning = (
  <div>
    <h1 className='accountPendingHeader'>Access Pending</h1>
    <p>
      Once the contract is signed by the person you appointed we will work to get you access to UID.
      Please understand that we cannot begin to process your request until we have a signed contract
      and agreement to terms. <br />
      <br />
      <b>
        An email has been sent to e.tacoma@shredders.com to create an account and sign the contract.
      </b>
    </p>
  </div>
);
function AccountPending() {
  const { participant } = useContext(ParticipantContext);

  return (
    <div className='accountPendingContent'>
      <CheckCircledIcon className='accountPendingIcon' />
      {participant?.status === ParticipantStatus.AwaitingSigning
        ? awaitingSigning
        : awaitingApproval}
    </div>
  );
}

export const AccountPendingRoute: PortalRoute = {
  path: '/account/pending',
  element: <AccountPending />,
  description: 'Account pending',
};
