import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ParticipantDTO } from '../../../api/entities/Participant';
import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { Banner } from '../Core/Banner';
import { Collapsible } from '../Core/Collapsible';
import { withoutRef } from '../Core/Form';
import { FormStyledCheckbox } from '../Input/StyledCheckbox';
import {
  BulkAddPermissionsForm,
  getCheckedParticipantTypeNames,
  getDefaultAdvertiserCheckboxState,
  getDefaultDataProviderCheckboxState,
  getDefaultDSPCheckboxState,
  getDefaultPublisherCheckboxState,
  getFilteredParticipantsByType,
  getRecommendationMessageFromTypeNames,
  getRecommendedTypeFromParticipant,
  hasUncheckedASharedType,
} from './bulkAddPermissionsHelpers';
import { ParticipantItemSimple } from './ParticipantItem';

import './BulkAddPermissions.scss';

type BulkAddPermissionsProps = {
  participant: ParticipantDTO | null;
  hasSharingParticipants: boolean;
  availableParticipants: AvailableParticipantDTO[];
  onBulkAddSharingPermission: (selectedTypes: string[]) => Promise<void>;
  sharedTypes: string[];
};

export function BulkAddPermissions({
  participant,
  hasSharingParticipants,
  availableParticipants,
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

  const hasCheckedType = useCallback(() => {
    return (
      watchPublisherChecked || watchAdvertiserChecked || watchDSPChecked || watchDataProviderChecked
    );
  }, [watchPublisherChecked, watchAdvertiserChecked, watchDSPChecked, watchDataProviderChecked]);

  const filteredParticipants = useMemo(() => {
    return getFilteredParticipantsByType(
      availableParticipants,
      watchPublisherChecked,
      watchAdvertiserChecked,
      watchDSPChecked,
      watchDataProviderChecked
    );
  }, [
    availableParticipants,
    watchPublisherChecked,
    watchAdvertiserChecked,
    watchDSPChecked,
    watchDataProviderChecked,
  ]);

  useEffect(() => {
    if (!hasCheckedType()) setShowRecommendedParticipants(false);
  }, [hasCheckedType]);

  const handleSave = (data: BulkAddPermissionsForm) => {
    onBulkAddSharingPermission(getCheckedParticipantTypeNames(data));
  };

  const savePermissionsButton = (
    <div className='bulk-add-permissions-footer'>
      <button type='submit' className='primary-button bulk-add-permissions-submit-button'>
        Save Permissions
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
        <FormStyledCheckbox {...withoutRef(register('publisherChecked'))} data-testid='publisher' />
        <span className='checkbox-label'>Publisher</span>
        <FormStyledCheckbox
          {...withoutRef(register('advertiserChecked'))}
          data-testid='advertiser'
        />
        <span className='checkbox-label'>Advertiser</span>
        <FormStyledCheckbox {...withoutRef(register('DSPChecked'))} data-testid='dsp' />
        <span className='checkbox-label'>DSP</span>
        <FormStyledCheckbox
          {...withoutRef(register('dataProviderChecked'))}
          data-testid='data-provider'
        />
        <span className='checkbox-label'>Data Provider</span>
      </div>
      {hasCheckedType() && (
        <button
          type='button'
          className='text-button bulk-add-permissions-view-recommendations-button'
          onClick={() => setShowRecommendedParticipants((prevToggle) => !prevToggle)}
        >
          {showRecommendedParticipants ? 'Hide Participants' : 'View Participants'}
        </button>
      )}
      {showRecommendedParticipants && hasCheckedType() && (
        <table className='bulk-add-permissions-participants-table'>
          <tbody>
            {filteredParticipants.map((p) => (
              <tr key={p.id}>
                <ParticipantItemSimple participant={p} />
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );

  const recommendationContent = (
    <div className='bulk-add-permissions'>
      <div className='bulk-add-permissions-body'>{commonContent}</div>
      {savePermissionsButton}
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
      {isDirty && savePermissionsButton}
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
