import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { AddDomainNamesFormProps } from '../../services/domainNamesService';
import { separateStringsWithSeparator } from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import { TextInput } from '../Input/TextInput';

import '../KeyPairs/KeyPairDialog.scss';

type AddDomainNamesDialogProps = Readonly<{
  onAddDomains: (newDomainNamesFormatted: string[]) => Promise<void>;
  triggerButton: JSX.Element;
}>;

function CstgAddDomainDialog({ onAddDomains, triggerButton }: AddDomainNamesDialogProps) {
  const [open, setOpen] = useState(false);

  const formMethods = useForm<AddDomainNamesFormProps>();
  const { handleSubmit, setValue, reset } = formMethods;

  useEffect(() => {
    if (!open) {
      setValue('newDomainNames', '');
      reset();
    }
  }, [open, setValue, reset]);

  const onSubmit = async (formData: AddDomainNamesFormProps) => {
    const newDomainNamesFormatted = separateStringsWithSeparator(formData.newDomainNames);
    await onAddDomains(newDomainNamesFormatted);
    setOpen(false);
  };

  return (
    <div className='key-pair-dialog'>
      <Dialog
        triggerButton={triggerButton}
        title='Add Domains'
        closeButtonText='Cancel'
        open={open}
        onOpenChange={setOpen}
      >
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            You may enter a single domain or enter domains as a comma separated list.
            <TextInput inputName='newDomainNames' label='Domain Names' required />
            <div className='form-footer'>
              <button type='submit' className='primary-button'>
                Add domains
              </button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default CstgAddDomainDialog;
