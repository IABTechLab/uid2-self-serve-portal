import { FormProvider, useForm } from 'react-hook-form';

import { AddDomainNamesFormProps } from '../../services/domainNamesService';
import { deduplicateStrings, separateStringsCommaSeparatedList } from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import { RootFormErrors } from '../Input/FormError';
import { TextInput } from '../Input/TextInput';
import { extractTopLevelDomain, isValidDomain } from './CstgDomainHelper';

import './CstgAddDomainDialog.scss';

type AddDomainNamesDialogProps = Readonly<{
  onAddDomains: (newDomainNamesFormatted: string[]) => Promise<void>;
  onOpenChange: () => void;
  existingDomains: string[];
}>;

function CstgAddDomainDialog({
  onAddDomains,
  onOpenChange,
  existingDomains,
}: AddDomainNamesDialogProps) {
  const formMethods = useForm<AddDomainNamesFormProps>();
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  const onSubmit = async (formData: AddDomainNamesFormProps) => {
    const newDomainNames = separateStringsCommaSeparatedList(formData.newDomainNames);
    // filter for uniqueness on what the user entered AND against existing domains
    const dedupedDomains = deduplicateStrings(newDomainNames);
    const uniqueDomains = dedupedDomains.filter((domain) => !existingDomains?.includes(domain));
    if (uniqueDomains.length === 0) {
      setError('root.serverError', {
        type: '400',
        message: 'The domain(s) you have entered already exist.',
      });
    } else {
      const allValid = uniqueDomains.every((newDomainName) => {
        return isValidDomain(newDomainName);
      });
      if (!allValid) {
        setError('root.serverError', {
          type: '400',
          message: 'At least one domain you have entered is invalid, please try again.',
        });
      } else {
        // if all are valid but there are some non top-level domains, we make sure every domain is top-level
        uniqueDomains.forEach((newDomainName, index) => {
          uniqueDomains[index] = extractTopLevelDomain(newDomainName);
        });
        await onAddDomains(uniqueDomains);
      }
    }
  };

  return (
    <div className='add-domain-dialog'>
      <Dialog title='Add Domain(s)' closeButtonText='Cancel' open onOpenChange={onOpenChange}>
        <RootFormErrors fieldErrors={errors} />
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            You may enter a single domain or enter domains as a comma separated list.
            <TextInput
              inputName='newDomainNames'
              label='Domain Name(s)'
              rules={{ required: 'Please specify domain name(s).' }}
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
