import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { InlineError } from '../Core/InlineError';
import BusinessContactDialog from './BusinessContactDialog';

type DeleteBusinessContactDialogProps = {
  contact: BusinessContactResponse;
  onRemoveContact: () => Promise<void>;
};

function DeleteBusinessContactDialog({
  contact,
  onRemoveContact,
}: DeleteBusinessContactDialogProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleRemove = async () => {
    setOpenDialog(false);
    await onRemoveContact();
  };

  return (
    <Dialog
      title='Are you sure you want to delete this email contact?'
      triggerButton={
        <button className='icon-button' aria-label='delete' type='button'>
          <FontAwesomeIcon icon='trash-can' />
        </button>
      }
      open={openDialog}
      onOpenChange={setOpenDialog}
    >
      <ul className='dot-list'>
        <li>{contact.name}</li>
      </ul>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleRemove}>
          Delete Email Contact
        </button>
        <button type='button' className='transparent-button' onClick={() => setOpenDialog(false)}>
          Cancel
        </button>
      </div>
    </Dialog>
  );
}

type BusinessContactProps = {
  contact: BusinessContactResponse;
  onRemoveEmailContact: (id: number) => Promise<void>;
  onUpdateEmailContact: (id: number, form: BusinessContactForm) => Promise<void>;
};

function BusinessContact({
  contact,
  onRemoveEmailContact,
  onUpdateEmailContact,
}: BusinessContactProps) {
  const [hasError, setHasError] = useState<boolean>(false);

  const handleRemoveEmailContact = async () => {
    try {
      await onRemoveEmailContact(contact.id);
    } catch {
      setHasError(true);
    }
  };

  const handleUpdateEmailContact = async (formData: BusinessContactForm) => {
    try {
      await onUpdateEmailContact(contact.id, formData);
    } catch {
      setHasError(true);
    }
  };

  return (
    <tr>
      <td>{contact.name}</td>
      <td>{contact.emailAlias}</td>
      <td>{contact.contactType}</td>
      <td className='action'>
        <div className='action-cell'>
          {hasError && <InlineError />}
          <div>
            <BusinessContactDialog
              onFormSubmit={handleUpdateEmailContact}
              contact={contact}
              triggerButton={
                <button className='icon-button' aria-label='edit' type='button'>
                  <FontAwesomeIcon icon='pencil' />
                </button>
              }
            />
            <DeleteBusinessContactDialog
              onRemoveContact={handleRemoveEmailContact}
              contact={contact}
            />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default BusinessContact;
