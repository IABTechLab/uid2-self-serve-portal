import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { AddDomainNamesFormProps } from '../../services/domainNamesService';
import { Dialog } from '../Core/Dialog';
import { TextInput } from '../Input/TextInput';

import '../KeyPairs/KeyPairDialog.scss';

type AddDomainNamesDialogProps = Readonly<{
  onAddDomains: (form: AddDomainNamesFormProps) => Promise<void>;
  triggerButton: JSX.Element;
}>;

function CstgAddDomainDialog({ onAddDomains, triggerButton }: AddDomainNamesDialogProps) {
  const [open, setOpen] = useState(false);

  const formMethods = useForm<AddDomainNamesFormProps>({
    defaultValues: {
      newDomainNames: '',
    },
  });
  const { handleSubmit } = formMethods;

  const onSubmit = async (formData: AddDomainNamesFormProps) => {
    await onAddDomains(formData);
    setOpen(false);
  };

  return (
    <div className='key-pair-dialog'>
      <Dialog
        triggerButton={triggerButton}
        title='Add Domain(s)'
        closeButtonText='Cancel'
        open={open}
        onOpenChange={setOpen}
      >
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            You may enter a single domain name or enter domain names as a comma separated list.
            <TextInput inputName='newDomainNames' label='Domain Name(s)' required />
            <div className='form-footer'>
              <button type='submit' className='primary-button'>
                Add domain(s)
              </button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default CstgAddDomainDialog;
