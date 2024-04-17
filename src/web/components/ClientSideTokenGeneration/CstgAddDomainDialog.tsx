import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { parse } from 'tldts';

import { AddDomainNamesFormProps } from '../../services/domainNamesService';
import { separateStringsCommaSeparatedList } from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import { InlineMessage } from '../Core/InlineMessage';
import { TextInput } from '../Input/TextInput';
import { extractTopLevelDomain, isValidDomain } from './CstgDomainHelper';

import '../KeyPairs/KeyPairDialog.scss';

type AddDomainNamesDialogProps = Readonly<{
  onAddDomains: (newDomainNamesFormatted: string[]) => Promise<void>;
  onOpenChange: () => void;
}>;

function CstgAddDomainDialog({ onAddDomains, onOpenChange }: AddDomainNamesDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string>();

  const formMethods = useForm<AddDomainNamesFormProps>();
  const { handleSubmit } = formMethods;

  const onSubmit = async (formData: AddDomainNamesFormProps) => {
    const newDomainNamesFormatted = separateStringsCommaSeparatedList(formData.newDomainNames);
    const allValid = newDomainNamesFormatted.every((newDomainName) => {
      return isValidDomain(newDomainName);
    });
    if (!allValid) {
      setErrorMessage('At least one domain you have entered is invalid, please try again.');
    } else {
      // if all are valid but there are some non top-level domains, we make sure every domain is top-level
      newDomainNamesFormatted.forEach((newDomainName, index) => {
        newDomainNamesFormatted[index] = extractTopLevelDomain(newDomainName);
      });
      await onAddDomains(newDomainNamesFormatted);
    }
  };

  return (
    <div className='key-pair-dialog'>
      <Dialog title='Add Domains' closeButtonText='Cancel' open onOpenChange={onOpenChange}>
        {!!errorMessage && <InlineMessage message={errorMessage} type='Error' />}
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            You may enter a single domain or enter domains as a comma separated list.
            <TextInput
              inputName='newDomainNames'
              label='Domain Names'
              rules={{ required: 'Please specify domain name.' }}
            />
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
