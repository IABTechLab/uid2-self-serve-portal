import { FormProvider, useForm } from 'react-hook-form';

import { ContactType } from '../../../api/entities/BusinessContact';
import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import { validateEmail } from '../../utils/textHelpers';
import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { Dialog } from '../Core/Popups/Dialog';
import { SelectInput } from '../Input/SelectInput';
import { TextInput } from '../Input/TextInput';

type BusinessContactDialogProps = Readonly<{
  onFormSubmit: (formData: BusinessContactForm) => Promise<void>;
  onOpenChange: () => void;
  contact?: BusinessContactResponse;
}>;

function BusinessContactDialog({
  onFormSubmit,
  onOpenChange,
  contact,
}: BusinessContactDialogProps) {
  const formMethods = useForm<BusinessContactForm>({
    defaultValues: contact,
  });
  const { handleSubmit } = formMethods;

  const onSubmit = async (formData: BusinessContactForm) => {
    await onFormSubmit(formData);
    onOpenChange();
  };

  return (
    <Dialog
      title={`${contact ? 'Edit' : 'Add'} Email Contact`}
      closeButtonText='Cancel'
      onOpenChange={onOpenChange}
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
              validate: (value: string) => {
                return validateEmail(value) ? true : 'Invalid email format.';
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
          <FormSubmitButton>Save Email Contact</FormSubmitButton>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default BusinessContactDialog;
