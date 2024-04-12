import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { parse } from 'tldts';

import { AddDomainNamesFormProps } from '../../services/domainNamesService';
import { separateStringsWithSeparator } from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import { InlineMessage } from '../Core/InlineMessage';
import { TextInput } from '../Input/TextInput';

import '../KeyPairs/KeyPairDialog.scss';

type AddDomainNamesDialogProps = Readonly<{
  onAddDomains: (newDomainNamesFormatted: string[]) => Promise<void>;
  triggerButton: JSX.Element;
}>;

type DomainProps = {
  isIcann: boolean | null;
  isPrivate: boolean | null;
  domain: string | null;
};

type ValidDomainProps = Omit<DomainProps, 'domain'> & { domain: string };

function CstgAddDomainDialog({ onAddDomains, triggerButton }: AddDomainNamesDialogProps) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const formMethods = useForm<AddDomainNamesFormProps>();
  const { handleSubmit, setValue, reset } = formMethods;

  useEffect(() => {
    if (!open) {
      setValue('newDomainNames', '');
      setErrorMessage('');
      reset();
    }
  }, [open, setValue, reset]);

  const isValidDomain = (domainProps: DomainProps): domainProps is ValidDomainProps => {
    return Boolean((domainProps.isIcann || domainProps.isPrivate) && domainProps.domain);
  };

  const onSubmit = async (formData: AddDomainNamesFormProps) => {
    const newDomainNamesFormatted = separateStringsWithSeparator(formData.newDomainNames);
    const allValid = newDomainNamesFormatted.every((newDomainName) => {
      return isValidDomain(parse(newDomainName));
    });
    if (!allValid) {
      setErrorMessage('At least one domain you have entered is invalid, please try again.');
    } else {
      // if all are valid but there are some non top-level domains, we turn every domain into top-level
      newDomainNamesFormatted.forEach((newDomainName, index) => {
        const topLevelDomain = parse(newDomainName).domain;
        if (topLevelDomain && topLevelDomain !== newDomainName) {
          newDomainNamesFormatted[index] = topLevelDomain;
        }
      });
      await onAddDomains(newDomainNamesFormatted);
      setOpen(false);
    }
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
        {!!errorMessage && <InlineMessage message={errorMessage} type='Error' />}
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
