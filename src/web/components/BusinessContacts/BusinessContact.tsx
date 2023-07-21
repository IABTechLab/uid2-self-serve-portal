import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import { InlineError } from '../Core/InlineError';
import BusinessContactDialog from './BusinessContactDialog';

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
          <button
            className='icon-button'
            aria-label='delete'
            type='button'
            onClick={handleRemoveEmailContact}
          >
            <FontAwesomeIcon icon='trash-can' />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default BusinessContact;
