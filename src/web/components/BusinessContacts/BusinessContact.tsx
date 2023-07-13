import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
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
  const handleRemoveEmailContact = async () => {
    await onRemoveEmailContact(contact.id);
  };

  const handleUpdateEmailContact = async (formData: BusinessContactForm) => {
    await onUpdateEmailContact(contact.id, formData);
  };

  return (
    <tr>
      <td>{contact.name}</td>
      <td>{contact.emailAlias}</td>
      <td>{contact.contactType}</td>
      <td className='action'>
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
      </td>
    </tr>
  );
}

export default BusinessContact;
