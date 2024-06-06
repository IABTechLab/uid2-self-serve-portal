import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { AddAppIdsFormProps } from '../../../services/appIdsService';
import {
  deduplicateStrings,
  formatStringsWithSeparator,
  separateStringsList,
} from '../../../utils/textHelpers';
import { Dialog } from '../../Core/Dialog';
import { RootFormErrors } from '../../Input/FormError';
import { MultilineTextInput } from '../../Input/MultilineTextInput';
import { StyledCheckbox } from '../../Input/StyledCheckbox';
import { getUniqueAppIds, isAppStoreId, isIOSBundleId, isJavaPackage } from '../CstgHelper';

import './CstgAddAppIdDialog.scss';

type AddAppIdDialogProps = Readonly<{
  onAddAppIds: (newAppIds: string[], deleteExistingList: boolean) => Promise<string[]>;
  onOpenChange: () => void;
  existingAppIds: string[];
}>;

function CstgAddAppIdDialog({ onAddAppIds, onOpenChange, existingAppIds }: AddAppIdDialogProps) {
  const [deleteExistingList, setDeleteExistingList] = useState<boolean>(false);
  const formMethods = useForm<AddAppIdsFormProps>();
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

  const validateAppIds = (appIds: string[]): string[] => {
    const invalidAppIds: string[] = [];
    appIds.forEach((appId) => {
      if (!(isAppStoreId(appId) || isJavaPackage(appId) || isIOSBundleId(appId))) {
        invalidAppIds.push(appId);
      }
    });
    return invalidAppIds;
  };

  const onSubmit = async (formData: AddAppIdsFormProps) => {
    const newAppIds = getUniqueAppIds(
      separateStringsList(formData.newAppIds),
      existingAppIds,
      deleteExistingList
    );
    if (newAppIds.length === 0) {
      handleError('The app ids entered already exist.');
    } else {
      // filter for uniqueness (e.g. 2 different domains entered could have the same root-level domain)
      const dedupedAppIds = deduplicateStrings(newAppIds);
      const invalidAppIds = validateAppIds(dedupedAppIds);
      if (invalidAppIds.length > 0) {
        handleError(
          `The mobile app ids entered are invalid: ' ${formatStringsWithSeparator(invalidAppIds)}`
        );
      } else {
        await onAddAppIds(dedupedAppIds, deleteExistingList);
      }
    }
  };

  const onClickCheckbox = () => {
    setDeleteExistingList(!deleteExistingList);
  };

  return (
    <div className='add-app-names-dialog'>
      <Dialog title='Add Mobile App Ids' closeButtonText='Cancel' onOpenChange={onOpenChange}>
        <div className='app-names-form-error'>
          <RootFormErrors fieldErrors={errors} />
        </div>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            Please register the Android App ID, iOS/tvOS Bundle ID and iOS App Store ID.
            <br />
            Valid separators: comma, semicolon, space, tab, or new line.
            <div className='checkbox-container'>
              <StyledCheckbox
                className='checkbox'
                onClick={onClickCheckbox}
                checked={deleteExistingList}
              />
              <div className='app-names-checkbox-text'>
                Replace all existing app ids with new ones.
              </div>
            </div>
            <MultilineTextInput
              inputName='newAppIds'
              label='AppIds'
              rules={{ required: 'Please specify mobile app ids.' }}
            />
            <div className='form-footer'>
              <button type='submit' className='primary-button'>
                {deleteExistingList ? 'Replace' : 'Add'} Mobile App Ids
              </button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default CstgAddAppIdDialog;
