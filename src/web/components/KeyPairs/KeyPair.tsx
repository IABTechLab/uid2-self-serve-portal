import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import log from 'loglevel';
import { useCallback, useState } from 'react';
import { TDS_VERSION } from 'tedious';

import { ApiError } from '../../utils/apiError';
// import { Dialog } from '../Core/Dialog';
import { InlineMessage } from '../Core/InlineMessage';
import { StatusNotificationType, StatusPopup } from '../Core/StatusPopup';
import { KeyPairModel } from './KeyPairModel';
// import TeamMemberDialog from './TeamMemberDialog';

type KeyPairProps = {
  keyPair: KeyPairModel;
  // resendInvite: (id: number) => Promise<void>;
  // onRemoveTeamMember: (id: number) => Promise<void>;
  // onUpdateTeamMember: (id: number, form: UpdateTeamMemberForm) => Promise<void>;
};

function KeyPair({
  keyPair,
}: // person,
// resendInvite,
// onRemoveTeamMember,
// onUpdateTeamMember,
KeyPairProps) {
  // const [reinviteState, setInviteState] = useState<InviteState>(InviteState.initial);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [statusPopup, setStatusPopup] = useState<StatusNotificationType>();

  const setErrorInfo = (e: Error) => {
    setErrorMessage(e.message);
  };

  // const onResendInvite = useCallback(async () => {
  //   if (reinviteState !== InviteState.initial) {
  //     log.error(`Unexpected click event on reinvite button`);
  //     return;
  //   }

  //   setInviteState(InviteState.inProgress);
  //   try {
  //     await resendInvite(person.id);
  //     setStatusPopup({
  //       type: 'Success',
  //       message: `Invitation sent`,
  //     });
  //     setShowStatusPopup(true);
  //     setInviteState(InviteState.sent);
  //   } catch (e) {
  //     setErrorInfo(e as Error);
  //     setInviteState(InviteState.error);
  //     const err = e as Error;
  //     const hasHash = Object.hasOwn(err, 'errorHash') && (e as ApiError).errorHash;
  //     const hash = hasHash ? `: (${(e as ApiError).errorHash})` : '';
  //     setStatusPopup({
  //       type: 'Error',
  //       message: `${err.message}${hash}`,
  //     });
  //     setShowStatusPopup(true);
  //   }
  // }, [person.id, reinviteState, resendInvite]);

  // const handleRemoveUser = async () => {
  //   try {
  //     await onRemoveTeamMember(person.id);
  //   } catch (e) {
  //     setErrorInfo(e as Error);
  //   }
  // };

  // const handleUpdateUser = async (formData: UpdateTeamMemberForm) => {
  //   try {
  //     await onUpdateTeamMember(person.id, formData);
  //   } catch (e) {
  //     setErrorInfo(e as Error);
  //   }
  // };

  return (
    <tr>
      {/* <td>
        <div className='name-cell'>
          {`${person.firstName} ${person.lastName}`}
          {person.acceptedTerms || <div className='pending-label'>Pending</div>}
        </div>
      </td>
      <td>{person.email}</td> */}
      <td className='subscription-id'>{keyPair.subscriptionId}</td>
      <td className='site-id'>{keyPair.siteId}</td>
      <td className='public-key'>{keyPair.publicKey}</td>
      <td className='created'>{keyPair.createdString}</td>
      <td className='actions' />
      {/* <td className='action'>
        <div className='action-cell'>
          {!!errorMessage && <InlineMessage message={errorMessage} type='Error' />}
          <div>
            {person.acceptedTerms || (
              <button
                type='button'
                className={clsx('invite-button', {
                  clickable: reinviteState === InviteState.initial,
                  error: reinviteState === InviteState.error,
                })}
                onClick={() => onResendInvite()}
              >
                {reinviteState === InviteState.initial && 'Resend Invitation'}
                {reinviteState === InviteState.inProgress && 'Sending...'}
                {reinviteState === InviteState.sent && 'Invitation Sent'}
                {reinviteState === InviteState.error && 'Try again later'}
              </button>
            )}
            <TeamMemberDialog
              onUpdateTeamMember={handleUpdateUser}
              person={person}
              triggerButton={
                <button className='icon-button' aria-label='edit' type='button'>
                  <FontAwesomeIcon icon='pencil' />
                </button>
              }
            />
            <DeleteConfirmationDialog onRemoveTeamMember={handleRemoveUser} person={person} />
          </div>
          {statusPopup && (
            <StatusPopup
              status={statusPopup!.type}
              show={showStatusPopup}
              setShow={setShowStatusPopup}
              message={statusPopup!.message}
            />
          )}
        </div>
      </td> */}
    </tr>
  );
}

export default KeyPair;
