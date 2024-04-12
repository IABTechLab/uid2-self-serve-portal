import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ContactType } from '../../../api/entities/BusinessContact';
import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import FormSubmitButton from '../Core/FormSubmitButton';
import { SelectInput } from '../Input/SelectInput';
import { TextInput } from '../Input/TextInput';

type BusinessContactDialogProps = Readonly<{
  onFormSubmit: (formData: BusinessContactForm) => Promise<void>;
  triggerButton: JSX.Element;
  contact?: BusinessContactResponse;
}>;

function BusinessContactDialog({
  onFormSubmit,
  triggerButton,
  contact,
}: BusinessContactDialogProps) {
  const [open, setOpen] = useState(false);

  const formMethods = useForm<BusinessContactForm>({
    defaultValues: contact,
  });
  const { handleSubmit } = formMethods;

  const onSubmit = async (formData: BusinessContactForm) => {
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
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <FormSubmitButton buttonText='Save Email Contact' />
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default BusinessContactDialog;
