import { useContext, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { UserRole } from '../../api/entities/User';
import { Dialog } from '../components/Core/Dialog';
import { Form } from '../components/Core/Form';
import { SelectInput } from '../components/Input/SelectInput';
import { TextInput } from '../components/Input/TextInput';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { AddEmailContact, EmailContactForm } from '../services/participant';

type AddBusinessContactProps = {
  onAddBusinessContact: () => void;
};

function BusinessContactDialog({ onAddBusinessContact }: AddBusinessContactProps) {
  const { participant } = useContext(ParticipantContext);
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<EmailContactForm> = async (formData) => {
    await AddEmailContact(formData, participant!.id);
    setOpen(false);
    onAddBusinessContact();
  };

  return (
    <Dialog
      triggerButton={
        <button className='small-button' type='button'>
          Add Email Contact
        </button>
      }
      title='Add Email Contact'
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<EmailContactForm> onSubmit={onSubmit} submitButtonText='Save Email Contact'>
        <TextInput
          inputName='name'
          label='Email Group Name'
          rules={{ required: 'Please specify email group name.' }}
        />
        <TextInput
          inputName='emailAlias'
          label='Email Alias'
          rules={{
            required: 'Please specify email alias.',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Entered value does not match email format',
            },
          }}
        />
        <SelectInput
          inputName='contactType'
          label='Contact Type'
          rules={{ required: 'Please specify contact type' }}
          options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
            optionLabel: UserRole[key],
            value: UserRole[key],
          }))}
        />
      </Form>
    </Dialog>
  );
}

export default BusinessContactDialog;
