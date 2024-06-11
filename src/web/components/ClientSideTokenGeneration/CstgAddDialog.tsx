import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  deduplicateStrings,
  formatStringsWithSeparator,
  separateStringsList,
} from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import { RootFormErrors } from '../Input/FormError';
import { MultilineTextInput } from '../Input/MultilineTextInput';
import { StyledCheckbox } from '../Input/StyledCheckbox';
import {
  AddCstgValuesFormProps,
  CstgValue,
  extractTopLevelDomain,
  validateAppId,
} from './CstgHelper';

import './CstgAddDialog.scss';

type CstgAddDialogProps = Readonly<{
  onAddCstgValues: (newValuesFormatted: string[], deleteExistingList: boolean) => Promise<string[]>;
  onOpenChange: () => void;
  existingCstgValues: string[];
  cstgValueName: CstgValue;
  getUniqueValues: (
    newCstgValues: string[],
    existingCstgValues: string[],
    deleteExistingList: boolean
  ) => string[];
  addInstructions: string;
}>;

function CstgAddDialog({
  onAddCstgValues,
  onOpenChange,
  existingCstgValues,
  cstgValueName,
  getUniqueValues,
  addInstructions,
}: CstgAddDialogProps) {
  const [deleteExistingList, setDeleteExistingList] = useState<boolean>(false);
  const formMethods = useForm<AddCstgValuesFormProps>();
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  const handleError = (message: string) => {
    setError('root.serverError', {
      type: '400',
      message,
    });
  };

  const onSubmit = async (formData: AddCstgValuesFormProps) => {
    const newCstgValues = getUniqueValues(
      separateStringsList(formData.cstgValues),
      existingCstgValues,
      deleteExistingList
    );
    if (newCstgValues.length === 0) {
      handleError(`The ${cstgValueName}s entered already exist.`);
    } else if (cstgValueName === CstgValue.Domain) {
      newCstgValues.forEach((newDomain, index) => {
        newCstgValues[index] = extractTopLevelDomain(newDomain);
      });
      // filter for uniqueness (e.g. 2 different domains entered could have the same root-level domain)
      const dedupedRootLevelDomains = deduplicateStrings(newCstgValues);
      const invalidDomains = await onAddCstgValues(dedupedRootLevelDomains, deleteExistingList);
      if (invalidDomains.length > 0) {
        handleError(
          `The domains entered are invalid root-level domains: ${formatStringsWithSeparator(
            invalidDomains
          )}`
        );
      }
    } else if (cstgValueName === CstgValue.MobileAppId) {
      const invalidAppIds: string[] = [];
      newCstgValues.forEach((newAppId) => {
        if (!validateAppId(newAppId)) {
          invalidAppIds.push(newAppId);
        }
      });
      if (invalidAppIds.length > 0) {
        handleError(
          `The mobile app ids entered are invalid: ' ${formatStringsWithSeparator(invalidAppIds)}`
        );
      } else {
        await onAddCstgValues(newCstgValues, deleteExistingList);
      }
    }
  };

  const onClickCheckbox = () => {
    setDeleteExistingList(!deleteExistingList);
  };

  return (
    <div className='cstg-add-dialog'>
      <Dialog title={`Add ${cstgValueName}s`} closeButtonText='Cancel' onOpenChange={onOpenChange}>
        <div className='cstg-form-error'>
          <RootFormErrors fieldErrors={errors} />
        </div>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {addInstructions} <br />
            Valid separators: comma, semicolon, space, tab, or new line.
            <div className='checkbox-container'>
              <StyledCheckbox
                className='checkbox'
                onClick={onClickCheckbox}
                checked={deleteExistingList}
              />
              <div className='checkbox-text'>{`Replace all existing ${cstgValueName.toLowerCase()}s with the new ones.`}</div>
            </div>
            <MultilineTextInput
              inputName='cstgValues'
              label={`${cstgValueName}s`}
              rules={{ required: `Please specify ${cstgValueName}s.` }}
            />
            <div className='form-footer'>
              <button type='submit' className='primary-button'>
                {deleteExistingList ? 'Replace' : 'Add'} {`${cstgValueName}s`}
              </button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default CstgAddDialog;
