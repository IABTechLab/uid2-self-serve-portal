import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { AddDomainNamesFormProps } from '../../services/domainNamesService';
import {
  deduplicateStrings,
  formatStringsWithSeparator,
  separateStringsList,
} from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import { TriStateCheckbox } from '../Core/TriStateCheckbox';
import { RootFormErrors } from '../Input/FormError';
import { MultilineTextInput } from '../Input/MultilineTextInput';
import { FormStyledCheckbox, StyledCheckbox } from '../Input/StyledCheckbox';
import { extractTopLevelDomain, isValidDomain } from './CstgDomainHelper';

import './CstgAddDomainDialog.scss';

type AddDomainNamesDialogProps = Readonly<{
  onAddDomains: (newDomainNamesFormatted: string[], deleteExistingList: boolean) => Promise<void>;
  onOpenChange: () => void;
  existingDomains: string[];
}>;

function CstgAddDomainDialog({
  onAddDomains,
  onOpenChange,
  existingDomains,
}: AddDomainNamesDialogProps) {
  const [deleteExistingList, setDeleteExistingList] = useState<boolean>(false);
  const formMethods = useForm<AddDomainNamesFormProps>();
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  const onSubmit = async (formData: AddDomainNamesFormProps) => {
    const newDomainNames = separateStringsList(formData.newDomainNames);
    // filter out domain names that already exist in the list
    const uniqueDomains = newDomainNames.filter((domain) => !existingDomains?.includes(domain));
    if (uniqueDomains.length === 0) {
      setError('root.serverError', {
        type: '400',
        message: 'The domain(s) you have entered already exist.',
      });
    } else {
      const invalidDomains: string[] = [];
      let allValid = true;
      uniqueDomains.forEach((newDomainName) => {
        if (!isValidDomain(newDomainName)) {
          invalidDomains.push(newDomainName);
          allValid = false;
        }
      });
      if (!allValid) {
        const message = `Some domains you have entered are invalid: ${formatStringsWithSeparator(
          invalidDomains
        )}`;
        setError('root.serverError', {
          type: '400',
          message,
        });
      } else {
        // if all are valid but there are some non top-level domains, we make sure every domain is top-level
        uniqueDomains.forEach((newDomainName, index) => {
          uniqueDomains[index] = extractTopLevelDomain(newDomainName);
        });
        // filter for uniqueness (e.g. 2 different domains entered could have the same top-level domain)
        const dedupedDomains = deduplicateStrings(uniqueDomains);
        await onAddDomains(dedupedDomains, deleteExistingList);
      }
    }
  };

  const onClickCheckbox = () => {
    setDeleteExistingList(!deleteExistingList);
  };

  return (
    <div className='add-domain-dialog'>
      <Dialog title='Add Domain(s)' closeButtonText='Cancel' open onOpenChange={onOpenChange}>
        <RootFormErrors fieldErrors={errors} />
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            You may enter a single or multiple domains.
            <div className='checkbox-container'>
              <StyledCheckbox
                className='checkbox'
                onClick={onClickCheckbox}
                checked={deleteExistingList}
              />
              Option to delete all existing domains before adding new ones.
            </div>
            <MultilineTextInput
              inputName='newDomainNames'
              label='Domain Name(s)'
              rules={{ required: 'Please specify domain name(s).' }}
            />
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
