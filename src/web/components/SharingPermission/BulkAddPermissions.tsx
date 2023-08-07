import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { Banner } from '../Core/Banner';
import { Collapsible } from '../Core/Collapsible';
import { FormStyledCheckbox } from '../Input/StyledCheckbox';
import {
  BulkAddPermissionsForm,
  getCheckedParticipantTypeIds,
  getDefaultAdvertiserCheckboxState,
  getDefaultDataProviderCheckboxState,
  getDefaultDSPCheckboxState,
  getDefaultPublisherCheckboxState,
  getRecommendationMessageFromTypeNames,
} from './bulkAddPermissionsHelpers';

import './BulkAddPermissions.scss';

type BulkAddPermissionsProps = {
  participant: ParticipantDTO | null;
  participantTypes: ParticipantTypeDTO[];
  hasSharingParticipants: boolean;
  onBulkAddSharingPermission: (selectedTypes: number[]) => Promise<void>;
};

export function BulkAddPermissions({
  participant,
  participantTypes,
  hasSharingParticipants,
  onBulkAddSharingPermission,
}: BulkAddPermissionsProps) {
  const [showRecommendedParticipants, setShowRecommendedParticipants] = useState(false);
  const currentParticipantTypeNames = participant?.types
    ? participant.types.map((p) => p.typeName ?? '')
    : [];
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
    formState: { isDirty },
  } = formMethods;

  const watchPublisherChecked = watch('publisherChecked');
  const watchAdvertiserChecked = watch('advertiserChecked');
  const watchDSPChecked = watch('DSPChecked');
  const watchDataProviderChecked = watch('dataProviderChecked');

  const handleSave = (data: BulkAddPermissionsForm) => {
    onBulkAddSharingPermission(getCheckedParticipantTypeIds(data, participantTypes));
  };

  const onToggleViewRecommendedParticipants = () => {
    setShowRecommendedParticipants((prevToggle) => !prevToggle);
    // TODO: show/hide the actual participants
  };

  const bulkAddPermissionsMessage = (
    <>
      <b>{getRecommendationMessageFromTypeNames(currentParticipantTypeNames)}</b>
      <p>
        Allow all current and future participants within a participation type to decrypt your UID2
        tokens.
      </p>
    </>
  );

  const viewRecommendedParticipantsButton = (
    <button
      type='button'
      className='text-button bulk-add-permissions-view-recommendations-button'
      onClick={onToggleViewRecommendedParticipants}
    >
      {showRecommendedParticipants ? 'Hide Participants' : 'View Participants'}
    </button>
  );

  const participantTypeCheckboxes = (
    <div className='participant-type-checkbox-section'>
      <FormStyledCheckbox
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('publisherChecked')}
      />
      <span className='checkbox-label'>Publisher</span>
      <FormStyledCheckbox
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('advertiserChecked')}
      />
      <span className='checkbox-label'>Advertiser</span>
      <FormStyledCheckbox
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('DSPChecked')}
      />
      <span className='checkbox-label'>DSP</span>
      <FormStyledCheckbox
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('dataProviderChecked')}
      />
      <span className='checkbox-label'>Data Provider</span>
    </div>
  );

  const saveRecommendationsButton = (
    <div className='bulk-add-permissions-footer'>
      <button type='submit' className='primary-button bulk-add-permissions-submit-button'>
        Save Recommendations
      </button>
    </div>
  );

  const recommendationContent = (
    <div className='bulk-add-permissions'>
      <div className='bulk-add-permissions-body'>
        {bulkAddPermissionsMessage}
        {participantTypeCheckboxes}
        {viewRecommendedParticipantsButton}
      </div>
      {saveRecommendationsButton}
    </div>
  );

  const collapsibleContent = (
    <div className='bulk-add-permissions'>
      <div className='bulk-add-permissions-body'>
        {bulkAddPermissionsMessage}
        {participantTypeCheckboxes}
        {/* Change this condition once we have APIs to get the which types have been shared with */}
        {false && (
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
    // eslint-disable-next-line react/jsx-props-no-spreading
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
