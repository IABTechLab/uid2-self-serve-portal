import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ContactType } from '../../api/entities/BusinessContact';
import { Dialog } from '../components/Core/Dialog';
import { Form } from '../components/Core/Form';
import { SelectInput } from '../components/Input/SelectInput';
import { TextInput } from '../components/Input/TextInput';
import { BusinessContactForm, BusinessContactResponse } from '../services/participant';

type BusinessContactDialogProps = {
  onFormSubmit: (formData: BusinessContactForm) => Promise<void>;
  onFormSubmitted: () => void;
  triggerButton: JSX.Element;
  contact?: BusinessContactResponse;
};

function BusinessContactDialog({
  onFormSubmit,
  onFormSubmitted,
  triggerButton,
  contact,
}: BusinessContactDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<BusinessContactForm> = async (formData) => {
    await onFormSubmit(formData);
    setOpen(false);
    onFormSubmitted();
  };

  return (
    <Dialog
      triggerButton={triggerButton}
      title={`${contact ? 'Edit' : 'Add'} Email Contact`}
      closeButton='Cancel'
      open={open}
      onOpenChange={setOpen}
    >
      <Form<BusinessContactForm>
        onSubmit={onSubmit}
        submitButtonText='Save Email Contact'
        defaultValues={contact as BusinessContactForm}
      >
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

export default BusinessContactDialog;
