import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  deduplicateStrings,
  formatStringsWithSeparator,
  separateStringsList,
} from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog/Dialog';
import { RootFormErrors } from '../Input/FormError';
import { MultilineTextInput } from '../Input/MultilineTextInput';
import { StyledCheckbox } from '../Input/StyledCheckbox';
import {
  AddCstgValuesFormProps,
  CstgValueType,
  extractTopLevelDomain,
  getUniqueCstgValues,
  validateAppId,
} from './CstgHelper';

import './CstgAddDialog.scss';

type CstgAddDialogProps = Readonly<{
  onAddCstgValues: (newValuesFormatted: string[], deleteExistingList: boolean) => Promise<string[]>;
  onOpenChange: () => void;
  existingCstgValues: string[];
  cstgValueType: CstgValueType;
  addInstructions: string;
}>;

function CstgAddDialog({
  onAddCstgValues,
  onOpenChange,
  existingCstgValues,
  cstgValueType,
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
    const newCstgValues = getUniqueCstgValues(
      separateStringsList(formData.cstgValues),
      existingCstgValues,
      deleteExistingList
    );
    if (newCstgValues.length === 0) {
      handleError(`The ${cstgValueType}s entered already exist.`);
    } else if (cstgValueType === CstgValueType.Domain) {
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
    } else if (cstgValueType === CstgValueType.MobileAppId) {
      const invalidAppIds: string[] = [];
      newCstgValues.forEach((newAppId) => {
        if (!validateAppId(newAppId)) {
          invalidAppIds.push(newAppId);
        }
      });
      if (invalidAppIds.length > 0) {
        handleError(
          `The mobile app IDs entered are invalid: ${formatStringsWithSeparator(invalidAppIds)}`
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
      <Dialog title={`Add ${cstgValueType}s`} closeButtonText='Cancel' onOpenChange={onOpenChange}>
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
              <div className='checkbox-text'>{`Replace all existing ${cstgValueType}s with the new ones.`}</div>
            </div>
            <MultilineTextInput
              inputName='cstgValues'
              label={`${cstgValueType}s`}
              rules={{ required: `Please specify ${cstgValueType}s.` }}
              className='cstg-add-input'
            />
            <div className='form-footer'>
              <button type='submit' className='primary-button'>
                {deleteExistingList ? 'Replace' : 'Add'} {`${cstgValueType}s`}
              </button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default CstgAddDialog;
