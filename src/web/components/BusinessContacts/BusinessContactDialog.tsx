import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ContactType } from '../../../api/entities/BusinessContact';
import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { SelectInput } from '../Input/SelectInput';
import { TextInput } from '../Input/TextInput';

type BusinessContactDialogProps = {
  onFormSubmit: (formData: BusinessContactForm) => Promise<void>;
  triggerButton: JSX.Element;
  contact?: BusinessContactResponse;
};

function BusinessContactDialog({
  onFormSubmit,
  triggerButton,
  contact,
}: BusinessContactDialogProps) {
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<BusinessContactForm> = async (formData) => {
    await onFormSubmit(formData);
    setOpen(false);
  };

  return (
    <Dialog
      triggerButton={triggerButton}
      title={`${contact ? 'Edit' : 'Add'} Email Contact`}
      closeButtonText='Cancel'
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
