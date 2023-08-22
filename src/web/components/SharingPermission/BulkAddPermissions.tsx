import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ParticipantDTO } from '../../../api/entities/Participant';
import { Banner } from '../Core/Banner';
import { Collapsible } from '../Core/Collapsible';
import { FormStyledCheckbox } from '../Input/StyledCheckbox';
import {
  BulkAddPermissionsForm,
  getCheckedParticipantTypeNames,
  getDefaultAdvertiserCheckboxState,
  getDefaultDataProviderCheckboxState,
  getDefaultDSPCheckboxState,
  getDefaultPublisherCheckboxState,
  getRecommendationMessageFromTypeNames,
  getRecommendedTypeFromParticipant,
  hasUncheckedASharedType,
} from './bulkAddPermissionsHelpers';

import './BulkAddPermissions.scss';

type BulkAddPermissionsProps = {
  participant: ParticipantDTO | null;
  hasSharingParticipants: boolean;
  onBulkAddSharingPermission: (selectedTypes: string[]) => Promise<void>;
  sharedTypes: string[];
};

export function BulkAddPermissions({
  participant,
  hasSharingParticipants,
  sharedTypes,
  onBulkAddSharingPermission,
}: BulkAddPermissionsProps) {
  const [showRecommendedParticipants, setShowRecommendedParticipants] = useState(false);

  const currentParticipantTypeNames = participant?.types
    ? participant.types.map((p) => p.typeName ?? '')
    : [];

  const recommendedTypes = getRecommendedTypeFromParticipant(currentParticipantTypeNames);

  const formMethods = useForm<BulkAddPermissionsForm>({
    defaultValues: {
      publisherChecked: getDefaultPublisherCheckboxState(currentParticipantTypeNames),
      advertiserChecked: getDefaultAdvertiserCheckboxState(currentParticipantTypeNames),
      DSPChecked: getDefaultDSPCheckboxState(currentParticipantTypeNames),
      dataProviderChecked: getDefaultDataProviderCheckboxState(currentParticipantTypeNames),
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = formMethods;

  useEffect(() => {
    if (sharedTypes && sharedTypes.length > 0) {
      setValue('publisherChecked', sharedTypes.includes('publisher'));
      setValue('advertiserChecked', sharedTypes.includes('advertiser'));
      setValue('DSPChecked', sharedTypes.includes('dsp'));
      setValue('dataProviderChecked', sharedTypes.includes('data_provider'));
    }
  }, [sharedTypes, setValue]);

  const watchPublisherChecked = watch('publisherChecked');
  const watchAdvertiserChecked = watch('advertiserChecked');
  const watchDSPChecked = watch('DSPChecked');
  const watchDataProviderChecked = watch('dataProviderChecked');

  const handleSave = (data: BulkAddPermissionsForm) => {
    onBulkAddSharingPermission(getCheckedParticipantTypeNames(data));
  };

  const onToggleViewRecommendedParticipants = () => {
    setShowRecommendedParticipants((prevToggle) => !prevToggle);
    // TODO: show/hide the actual participants
  };

  const saveRecommendationsButton = (
    <div className='bulk-add-permissions-footer'>
      <button type='submit' className='primary-button bulk-add-permissions-submit-button'>
        Save Recommendations
      </button>
    </div>
  );

  const commonContent = (
    <>
      <b>{getRecommendationMessageFromTypeNames(currentParticipantTypeNames, recommendedTypes)}</b>
      <p>
        Allow all current and future participants within a participation type to decrypt your UID2
        tokens.
      </p>
      <div className='participant-type-checkbox-section'>
        <FormStyledCheckbox {...register('publisherChecked')} data-testid='publisher' />
        <span className='checkbox-label'>Publisher</span>
        <FormStyledCheckbox {...register('advertiserChecked')} data-testid='advertiser' />
        <span className='checkbox-label'>Advertiser</span>
        <FormStyledCheckbox {...register('DSPChecked')} data-testid='dsp' />
        <span className='checkbox-label'>DSP</span>
        <FormStyledCheckbox {...register('dataProviderChecked')} data-testid='data-provider' />
        <span className='checkbox-label'>Data Provider</span>
      </div>
      {(watchPublisherChecked ||
        watchAdvertiserChecked ||
        watchDSPChecked ||
        watchDataProviderChecked) && (
        <button
          type='button'
          className='text-button bulk-add-permissions-view-recommendations-button'
          onClick={onToggleViewRecommendedParticipants}
        >
          {showRecommendedParticipants ? 'Hide Participants' : 'View Participants'}
        </button>
      )}
    </>
  );

  const recommendationContent = (
    <div className='bulk-add-permissions'>
      <div className='bulk-add-permissions-body'>{commonContent}</div>
      {saveRecommendationsButton}
    </div>
  );

  const collapsibleContent = (
    <div className='bulk-add-permissions'>
      <div className='bulk-add-permissions-body'>
        {commonContent}
        {hasUncheckedASharedType(
          sharedTypes,
          watchPublisherChecked,
          watchAdvertiserChecked,
          watchDSPChecked,
          watchDataProviderChecked
        ) && (
          <div className='remove-recommended-type-warning'>
            <Banner
              type='warning'
              message='If you remove the sharing permissions for a participant type, all sharing permissions of that type are removed, including future participants of that type.'
            />
          </div>
        )}
      </div>
      {isDirty && saveRecommendationsButton}
    </div>
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleSave)}>
        {!hasSharingParticipants && (
          <Collapsible
            title='Bulk Add Permissions'
            defaultOpen
            label='RECOMMENDATION'
            className='bulk-add-permissions-recommendations-collapsible'
          >
            {recommendationContent}
          </Collapsible>
        )}
        {hasSharingParticipants && (
          <Collapsible title='Bulk Add Permissions' defaultOpen={false}>
            {collapsibleContent}
          </Collapsible>
        )}
      </form>
    </FormProvider>
  );
}
