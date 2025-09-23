import { useState } from 'react';

import { EmailContactForm, EmailContactResponse } from '../../services/participant';
import ActionButton from '../Core/Buttons/ActionButton';
import { Dialog } from '../Core/Dialog/Dialog';
import { InlineMessage } from '../Core/InlineMessages/InlineMessage';
import EmailContactDialog from './EmailContactDialog';

type DeleteEmailContactDialogProps = Readonly<{
  contact: EmailContactResponse;
  onRemoveContact: () => Promise<void>;
  onOpenChange: () => void;
}>;

function DeleteEmailContactDialog({
  contact,
  onRemoveContact,
  onOpenChange,
}: DeleteEmailContactDialogProps) {
  const handleRemove = async () => {
    await onRemoveContact();
    onOpenChange();
  };

  return (
    <Dialog
      title='Are you sure you want to delete this email contact?'
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      <ul className='dot-list'>
        <li>{contact.name}</li>
      </ul>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleRemove}>
          Delete Email Contact
        </button>
      </div>
    </Dialog>
  );
}

type EmailContactProps = Readonly<{
  contact: EmailContactResponse;
  onRemoveEmailContact: (id: number) => Promise<void>;
  onUpdateEmailContact: (id: number, form: EmailContactForm) => Promise<void>;
}>;

function EmailContact({
  contact,
  onRemoveEmailContact,
  onUpdateEmailContact,
}: EmailContactProps) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showEditEmailContactDialog, setShowEditEmailContactDialog] = useState<boolean>(false);
  const [showDeleteEmailContactDialog, setShowDeleteEmailContactDialog] =
    useState<boolean>(false);

  const setErrorInfo = (e: Error) => {
    setErrorMessage(e.message);
  };

  const onOpenChangeDeleteEmailContactDialog = () => {
    setShowDeleteEmailContactDialog(!showDeleteEmailContactDialog);
  };

  const onOpenChangeEditEmailContactDialog = () => {
    setShowEditEmailContactDialog(!showEditEmailContactDialog);
  };

  const handleRemoveEmailContact = async () => {
    try {
      await onRemoveEmailContact(contact.id);
      onOpenChangeDeleteEmailContactDialog();
    } catch (e) {
      setErrorInfo(e as Error);
    }
  };

  const handleUpdateEmailContact = async (formData: EmailContactForm) => {
    try {
      await onUpdateEmailContact(contact.id, formData);
    } catch (e) {
      setErrorInfo(e as Error);
    }
  };

  return (
    <tr>
      <td>{contact.name}</td>
      <td>{contact.emailAlias}</td>
      <td>{contact.contactType}</td>
      <td className='action'>
        <div className='action-cell'>
          {!!errorMessage && <InlineMessage message={errorMessage} type='Error' />}
          <div>
            <ActionButton onClick={onOpenChangeEditEmailContactDialog} icon='pencil' />
            {showEditEmailContactDialog && (
              <EmailContactDialog
                onFormSubmit={handleUpdateEmailContact}
                contact={contact}
                onOpenChange={onOpenChangeEditEmailContactDialog}
              />
            )}

            <ActionButton onClick={onOpenChangeDeleteEmailContactDialog} icon='trash-can' />
            {showDeleteEmailContactDialog && (
              <DeleteEmailContactDialog
                onRemoveContact={handleRemoveEmailContact}
                contact={contact}
                onOpenChange={onOpenChangeDeleteEmailContactDialog}
              />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default EmailContact;
