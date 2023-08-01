import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ParticipantDTO } from '../../../api/entities/Participant';
import { FormStyledCheckbox } from '../Input/StyledCheckbox';
import {
  getDefaultAdvertiserCheckboxState,
  getDefaultDataProviderCheckboxState,
  getDefaultDSPCheckboxState,
  getDefaultPublisherCheckboxState,
  getRecommendationMessageFromTypeNames,
} from './bulkAddPermissionsHelpers';

import './BulkAddPermissions.scss';

type BulkAddPermissionsProps = {
  participant: ParticipantDTO | null;
  onBulkAddSharingPermission: (selectedTypes: number[]) => Promise<void>;
};

export type BulkAddPermissionsForm = {
  publisherChecked: boolean;
  advertiserChecked: boolean;
  DSPChecked: boolean;
  dataProviderChecked: boolean;
};

export function BulkAddPermissions({
  participant,
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

  const { register, handleSubmit } = formMethods;

  const handleSave = (data: BulkAddPermissionsForm) => {
    // TODO: call onBulkAddSharingPermission with the appropriate data
  };

  const onToggleShowRecommendedParticipants = () => {
    setShowRecommendedParticipants((prevToggle) => !prevToggle);
    // TODO: show the actual participants
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleSave)}>
        <div className='bulk-add-permissions'>
          <div className='bulk-add-permissions-header'>
            <h2>Bulk Add Permissions</h2>
            <div className='recommendation-label'>RECOMMENDATION</div>
          </div>
          <div className='bulk-add-permissions-body'>
            <b>{getRecommendationMessageFromTypeNames(currentParticipantTypeNames)}</b>
            <p>
              Allow all current and future participants within a participation type to decrypt your
              UID2 tokens.
            </p>
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
            <button
              type='button'
              className='text-button bulk-add-permissions-view-recommendations-button'
              onClick={onToggleShowRecommendedParticipants}
            >
              {showRecommendedParticipants
                ? 'Hide Recommended Participants'
                : 'View Recommended Participants'}
            </button>
          </div>
          <div className='bulk-add-permissions-footer'>
            <button type='submit' className='primary-button bulk-add-permissions-submit-button'>
              Save Recommendations
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
