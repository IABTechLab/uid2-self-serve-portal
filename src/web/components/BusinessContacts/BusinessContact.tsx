import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import BusinessContactDialog from './BusinessContactDialog';

type BusinessContactProps = {
  contact: BusinessContactResponse;
  onBusinessContactUpdated: () => void;
  removeEmailContact: (id: number) => Promise<void>;
  updateEmailContact: (id: number, form: BusinessContactForm) => Promise<void>;
};

function BusinessContact({
  contact,
  onBusinessContactUpdated,
  removeEmailContact,
  updateEmailContact,
}: BusinessContactProps) {
  const onRemoveEmailContact = async () => {
    await removeEmailContact(contact.id);
    onBusinessContactUpdated();
  };

  const onUpdateEmailContact = async (formData: BusinessContactForm) => {
    await updateEmailContact(contact.id, formData);
  };

  return (
    <tr>
      <td>{contact.name}</td>
      <td>{contact.emailAlias}</td>
      <td>{contact.contactType}</td>
      <td className='action'>
        <BusinessContactDialog
          onFormSubmit={onUpdateEmailContact}
          onFormSubmitted={onBusinessContactUpdated}
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
          onClick={onRemoveEmailContact}
        >
          <FontAwesomeIcon icon='trash-can' />
        </button>
      </td>
    </tr>
  );
}

export default BusinessContact;
