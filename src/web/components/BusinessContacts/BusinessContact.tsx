import { useState } from 'react';

import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import ActionButton from '../Core/Buttons/ActionButton';
import { InlineMessage } from '../Core/InlineMessages/InlineMessage';
import { Dialog } from '../Core/Dialog/Dialog';
import BusinessContactDialog from './BusinessContactDialog';

type DeleteBusinessContactDialogProps = Readonly<{
  contact: BusinessContactResponse;
  onRemoveContact: () => Promise<void>;
  onOpenChange: () => void;
}>;

function DeleteBusinessContactDialog({
  contact,
  onRemoveContact,
  onOpenChange,
}: DeleteBusinessContactDialogProps) {
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

type BusinessContactProps = Readonly<{
  contact: BusinessContactResponse;
  onRemoveEmailContact: (id: number) => Promise<void>;
  onUpdateEmailContact: (id: number, form: BusinessContactForm) => Promise<void>;
}>;

function BusinessContact({
  contact,
  onRemoveEmailContact,
  onUpdateEmailContact,
}: BusinessContactProps) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showEditBusinessDialog, setShowEditBusinessDialog] = useState<boolean>(false);
  const [showDeleteBusinessContactDialog, setShowDeleteBusinessContactDialog] =
    useState<boolean>(false);

  const setErrorInfo = (e: Error) => {
    setErrorMessage(e.message);
  };

  const onOpenChangeDeleteBusinessContactDialog = () => {
    setShowDeleteBusinessContactDialog(!showDeleteBusinessContactDialog);
  };

  const onOpenChangeEditBusinessContactDialog = () => {
    setShowEditBusinessDialog(!showEditBusinessDialog);
  };

  const handleRemoveEmailContact = async () => {
    try {
      await onRemoveEmailContact(contact.id);
      onOpenChangeDeleteBusinessContactDialog();
    } catch (e) {
      setErrorInfo(e as Error);
    }
  };

  const handleUpdateEmailContact = async (formData: BusinessContactForm) => {
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
            <ActionButton onClick={onOpenChangeEditBusinessContactDialog} icon='pencil' />
            {showEditBusinessDialog && (
              <BusinessContactDialog
                onFormSubmit={handleUpdateEmailContact}
                contact={contact}
                onOpenChange={onOpenChangeEditBusinessContactDialog}
              />
            )}

            <ActionButton onClick={onOpenChangeDeleteBusinessContactDialog} icon='trash-can' />
            {showDeleteBusinessContactDialog && (
              <DeleteBusinessContactDialog
                onRemoveContact={handleRemoveEmailContact}
                contact={contact}
                onOpenChange={onOpenChangeDeleteBusinessContactDialog}
              />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default BusinessContact;
