import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { AddDomainNamesFormProps } from '../../services/domainNamesService';
import {
  deduplicateStrings,
  formatStringsWithSeparator,
  separateStringsList,
} from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import { RootFormErrors } from '../Input/FormError';
import { MultilineTextInput } from '../Input/MultilineTextInput';
import { StyledCheckbox } from '../Input/StyledCheckbox';

import './CstgAddDomainDialog.scss';

type AddDomainNamesDialogProps = Readonly<{
  onAddDomains: (newDomainsFormatted: string[], deleteExistingList: boolean) => Promise<void>;
  onOpenChange: () => void;
  existingDomains: string[];
  invalidDomains: string[];
}>;

function CstgAddDomainDialog({
  onAddDomains,
  onOpenChange,
  existingDomains,
  invalidDomains,
}: AddDomainNamesDialogProps) {
  const [deleteExistingList, setDeleteExistingList] = useState<boolean>(false);
  const formMethods = useForm<AddDomainNamesFormProps>();
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (invalidDomains.length > 0) {
      setError('root.serverError', {
        type: '400',
        message: `The domains entered are invalid root-level domains: ${formatStringsWithSeparator(
          invalidDomains
        )}`,
      });
    }
  }, [invalidDomains, setError]);

  const onSubmit = async (formData: AddDomainNamesFormProps) => {
    const newDomains = separateStringsList(formData.newDomains);
    // filter out domain names that already exist in the list unless existing list is being deleted
    const uniqueDomains = deleteExistingList
      ? newDomains
      : newDomains.filter((domain) => !existingDomains?.includes(domain));
    if (uniqueDomains.length === 0) {
      setError('root.serverError', {
        type: '400',
        message: 'The domains entered already exist.',
      });
    } else {
      // filter for uniqueness (e.g. 2 different domains entered could have the same root-level domain)
      const dedupedDomains = deduplicateStrings(uniqueDomains);
      await onAddDomains(dedupedDomains, deleteExistingList);
    }
  };

  const onClickCheckbox = () => {
    setDeleteExistingList(!deleteExistingList);
  };

  return (
    <div className='add-domain-dialog'>
      <Dialog title='Add Domains' closeButtonText='Cancel' onOpenChange={onOpenChange}>
        <div className='domains-form-error'>
          <RootFormErrors fieldErrors={errors} />
        </div>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            Add one or more domains. <br />
            Valid separators: comma, semicolon, space, tab, or new line.
            <div className='checkbox-container'>
              <StyledCheckbox
                className='checkbox'
                onClick={onClickCheckbox}
                checked={deleteExistingList}
              />
              <div className='checkbox-text'>Replace all existing domains with the new ones.</div>
            </div>
            <MultilineTextInput
              inputName='newDomains'
              label='Domains'
              rules={{ required: 'Please specify domains.' }}
            />
            <div className='form-footer'>
              <button type='submit' className='primary-button'>
                {deleteExistingList ? 'Replace' : 'Add'} Domains
              </button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default CstgAddDomainDialog;
