import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ContactType } from '../../api/entities/BusinessContact';
import { Dialog } from '../components/Core/Dialog';
import { Form } from '../components/Core/Form';
import { SelectInput } from '../components/Input/SelectInput';
import { TextInput } from '../components/Input/TextInput';
import { AddEmailContact, BusinessContactForm } from '../services/participant';

type AddBusinessContactProps = {
  onAddBusinessContact: () => void;
};

function AddBusinessContactDialog({ onAddBusinessContact }: AddBusinessContactProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<BusinessContactForm> = async (formData) => {
    await AddEmailContact(formData);
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
      <Form<BusinessContactForm> onSubmit={onSubmit} submitButtonText='Save Email Contact'>
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
          options={(Object.keys(ContactType) as Array<keyof typeof ContactType>).map((key) => ({
            optionLabel: ContactType[key],
            value: ContactType[key],
          }))}
        />
      </Form>
    </Dialog>
  );
}

export default AddBusinessContactDialog;
