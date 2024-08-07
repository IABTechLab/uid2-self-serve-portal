import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ParticipantDTO } from '../../../api/entities/Participant';
import { ClientType } from '../../../api/services/adminServiceHelpers';
import { useAvailableSiteList } from '../../services/site';
import { Banner } from '../Core/Banner/Banner';
import { Collapsible } from '../Core/Collapsible/Collapsible';
import { Loading } from '../Core/Loading/Loading';
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
  hasPendingTypeChanges,
  hasUncheckedASharedType,
  publisherHasUncheckedDSP,
} from './bulkAddPermissionsHelpers';
import { ParticipantItemSimple } from './ParticipantItem';

import './BulkAddPermissions.scss';

type BulkAddPermissionsProps = {
  participant: ParticipantDTO | null;
  onBulkAddSharingPermission: (selectedTypes: ClientType[]) => Promise<void>;
  sharedTypes: ClientType[];
};

export function BulkAddPermissions({
  participant,
  sharedTypes,
  onBulkAddSharingPermission,
}: BulkAddPermissionsProps) {
  const [showRecommendedSiteTypes, setShowRecommendedSiteTypes] = useState(false);
  const currentParticipantTypeNames = participant?.types
    ? participant.types.map((p) => p.typeName ?? '')
    : [];
  const { sites: availableParticipants, isLoading } = useAvailableSiteList();

  const recommendedTypes = getRecommendedTypeFromParticipant(currentParticipantTypeNames);

  const formMethods = useForm<BulkAddPermissionsForm>({
    defaultValues: {
      publisherChecked: getDefaultPublisherCheckboxState(currentParticipantTypeNames),
      advertiserChecked: getDefaultAdvertiserCheckboxState(currentParticipantTypeNames),
      DSPChecked: getDefaultDSPCheckboxState(currentParticipantTypeNames),
      dataProviderChecked: getDefaultDataProviderCheckboxState(currentParticipantTypeNames),
    },
  });

  const { register, handleSubmit, watch, setValue } = formMethods;

  useEffect(() => {
    if (participant?.completedRecommendations) {
      setValue('publisherChecked', sharedTypes.includes('PUBLISHER'));
      setValue('advertiserChecked', sharedTypes.includes('ADVERTISER'));
      setValue('DSPChecked', sharedTypes.includes('DSP'));
      setValue('dataProviderChecked', sharedTypes.includes('DATA_PROVIDER'));
    }
  }, [sharedTypes, setValue, participant?.completedRecommendations]);

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
      availableParticipants || [],
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
    if (!hasCheckedType()) setShowRecommendedSiteTypes(false);
  }, [hasCheckedType]);

  const handleSave = (data: BulkAddPermissionsForm) => {
    onBulkAddSharingPermission(getCheckedParticipantTypeNames(data));
  };

  const savePermissionsButton = (
    <div className='bulk-add-permissions-footer'>
      <button
        type='submit'
        className='primary-button bulk-add-permissions-submit-button'
        disabled={
          !hasPendingTypeChanges(
            sharedTypes,
            watchPublisherChecked,
            watchAdvertiserChecked,
            watchDSPChecked,
            watchDataProviderChecked
          )
        }
      >
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
        <FormStyledCheckbox {...register('publisherChecked')} data-testid='publisher' />
        <span className='checkbox-label'>Publisher</span>
        <FormStyledCheckbox {...register('advertiserChecked')} data-testid='advertiser' />
        <span className='checkbox-label'>Advertiser</span>
        <FormStyledCheckbox {...register('DSPChecked')} data-testid='dsp' />
        <span className='checkbox-label'>DSP</span>
        <FormStyledCheckbox {...register('dataProviderChecked')} data-testid='data-provider' />
        <span className='checkbox-label'>Data Provider</span>
      </div>
      {hasCheckedType() && (
        <button
          type='button'
          className='text-button bulk-add-permissions-view-recommendations-button'
          onClick={() => setShowRecommendedSiteTypes((prevToggle) => !prevToggle)}
        >
          {showRecommendedSiteTypes ? 'Hide Participants' : 'View Participants'}
        </button>
      )}
      {showRecommendedSiteTypes && hasCheckedType() && (
        <table className='bulk-add-permissions-participants-table'>
          <tbody>
            {filteredParticipants.map((p) => (
              <tr key={p.id}>
                <ParticipantItemSimple site={p} />
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );

  const publisherUncheckDSPWarning = publisherHasUncheckedDSP(
    participant!.types || [],
    watchDSPChecked,
    sharedTypes,
    participant!.completedRecommendations
  ) && (
    <Banner
      type='Warning'
      message='As a publisher, if you remove the sharing permission of DSPs, DSPs will no longer be able to decrypt your UID2 tokens. This means that DSPs cannot bid on any UID2 tokens you pass to them within the bid stream. Please proceed with caution.'
    />
  );

  const recommendationContent = (
    <div className='bulk-add-permissions'>
      <div className='bulk-add-permissions-body'>
        {commonContent}
        <div className='bulk-add-permissions-body-warnings'>{publisherUncheckDSPWarning}</div>
      </div>
      {savePermissionsButton}
    </div>
  );

  const collapsibleContent = (
    <div className='bulk-add-permissions'>
      <div className='bulk-add-permissions-body'>
        {commonContent}
        <div className='bulk-add-permissions-body-warnings'>
          {hasUncheckedASharedType(
            sharedTypes,
            watchPublisherChecked,
            watchAdvertiserChecked,
            watchDSPChecked,
            watchDataProviderChecked
          ) && (
            <Banner
              type='Warning'
              message='If you remove the sharing permissions for a participant type, all sharing permissions of that type are removed, including future participants of that type.'
            />
          )}
          {publisherUncheckDSPWarning}
        </div>
      </div>
      {savePermissionsButton}
    </div>
  );

  if (isLoading) return <Loading />;

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleSave)}>
        {!participant?.completedRecommendations && (
          <Collapsible
            title='Add Permissions — Bulk'
            defaultOpen
            label='RECOMMENDATION'
            className='bulk-add-permissions-recommendations-collapsible'
          >
            {recommendationContent}
          </Collapsible>
        )}
        {participant?.completedRecommendations && (
          <Collapsible title='Add Permissions — Bulk' defaultOpen={false}>
            {collapsibleContent}
          </Collapsible>
        )}
      </form>
    </FormProvider>
  );
}
