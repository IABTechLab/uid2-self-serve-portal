import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { UserRole } from '../../../api/entities/User';
import { CreateParticipantForm } from '../../services/participant';
import { Dialog } from '../Core/Dialog';
import { TermsAndConditionsForm } from '../Core/TermsAndConditions';
import { FormError, RootFormErrors, setGlobalErrors } from '../Input/FormError';
import { MultiCheckboxInput } from '../Input/MultiCheckboxInput';
import { SelectInput } from '../Input/SelectInput';
import { FormStyledCheckbox } from '../Input/StyledCheckbox';
import { TextInput } from '../Input/TextInput';

import './createAccountForm.scss';
import '../../styles/forms.scss';

export type CreateAccountFormProps = {
  resolvedParticipantTypes: ParticipantTypeDTO[];
  onSubmit: (data: CreateParticipantForm) => Promise<string[] | void>;
};
export function CreateAccountForm({ resolvedParticipantTypes, onSubmit }: CreateAccountFormProps) {
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const formMethods = useForm<CreateParticipantForm>({
    defaultValues: {
      agreeToTerms: false,
    },
  });
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = formMethods;

  const handleSubmitAndReportErrors = async (data: CreateParticipantForm) => {
    const errorMessages = await onSubmit(data);
    if (errorMessages?.length) setGlobalErrors(setError, errorMessages);
  };

  const handleAccept = () => {
    setValue('agreeToTerms', true);
    setShowTermsDialog(false);
  };
  const watchAccept = watch('agreeToTerms');

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(handleSubmitAndReportErrors)}>
        <RootFormErrors fieldErrors={errors}>
          Something went wrong creating your account. Please review the following error information,
          and if the problem persists contact support.
        </RootFormErrors>
        <TextInput
          inputName='companyName'
          label='Participant Name'
          rules={{ required: 'Please specify participant name.' }}
        />
        <MultiCheckboxInput
          inputName='companyType'
          label='Participant Type'
          options={resolvedParticipantTypes.map((p) => ({
            optionLabel: p.typeName,
            value: p.id,
          }))}
          rules={{ required: 'Please specify Participant type.' }}
        />
        <SelectInput
          inputName='role'
          label='Job Function'
          rules={{ required: 'Please specify your job function.' }}
          options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
            optionLabel: UserRole[key],
            value: UserRole[key],
          }))}
        />
        <div className='terms-section'>
          <FormStyledCheckbox
            disabled={!watchAccept}
            {...register('agreeToTerms', { required: true })}
          />
          <span>
            I agree to the{' '}
            <button type='button' className='text-button' onClick={() => setShowTermsDialog(true)}>
              Terms and Conditions
            </button>{' '}
            (must click link)
          </span>
          {showTermsDialog && (
            <Dialog open onOpenChange={setShowTermsDialog} className='terms-conditions-dialog'>
              <TermsAndConditionsForm
                onAccept={handleAccept}
                onCancel={() => setShowTermsDialog(false)}
              />
            </Dialog>
          )}
        </div>
        <FormError display={!!errors.agreeToTerms}>
          Please click the link above to accept the terms and conditions.
        </FormError>
        <div className='privacy-section'>
          View our{' '}
          <a
            className='outside-link'
            target='_blank'
            href='https://www.thetradedesk.com/us/website-privacy-policy'
            rel='noreferrer'
          >
            Privacy Policies
          </a>
        </div>
        {/* Contract Sign will be introduced in phase 2 */}
        {/* <RadioInput
            inputName='canSign'
            label='Do you have the ability to sign a contract for UID Integration'
            options={[
              { optionLabel: 'Yes', value: true },
              { optionLabel: 'No', value: false },
            ]}
            aria-invalid={errors.canSign ? 'true' : 'false'}
            control={control}
          />
          {typeof watchCanSign == 'boolean' && (
            <div className='form-message-container'>
              {watchCanSign
                ? 'Great! Once you Request Access you will be presented the UID contract and terms.'
                : 'Before we can grant access to your company, we will need a signed contract and agreement to our terms.\nDo you have an email address for who can sign the UID Contract?'}
            </div>
          )} */}

        {/* {watchCanSign === false && (
                <TextInput inputName='signeeEmail' label='Email for Contract Signee' />
              )} */}
        <div className='form-footer'>
          <button type='submit' className='primary-button' disabled={!watchAccept}>
            Request Account
          </button>
        </div>
        <div className='verification-text'>
          You’ll receive an email verification. When your email is verified and we’ve approved your
          account, we’ll send you the account details.
        </div>
      </form>
    </FormProvider>
  );
}
