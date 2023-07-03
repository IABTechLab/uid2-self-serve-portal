/* eslint-disable react/jsx-props-no-spreading */
import { Suspense, useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Await, defer, useLoaderData, useNavigate } from 'react-router-dom';

import { ParticipantType } from '../../api/entities/ParticipantType';
import { UserRole } from '../../api/entities/User';
import { Card } from '../components/Core/Card';
import { Dialog } from '../components/Core/Dialog';
import { withoutRef } from '../components/Core/Form';
import { Loading } from '../components/Core/Loading';
import { TermsAndConditions } from '../components/Core/TermsAndConditions';
import { CheckboxInput } from '../components/Input/CheckboxInput';
import { FormError, RootFormErrors } from '../components/Input/FormError';
import { SelectInput } from '../components/Input/SelectInput';
import { FormStyledCheckbox } from '../components/Input/StyledCheckbox';
import { TextInput } from '../components/Input/TextInput';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { CreateParticipant, CreateParticipantForm } from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { PortalRoute } from './routeUtils';

import '../components/Core/Form.scss';
import './createAccount.scss';

export const AccountCreationRoutes: PortalRoute[] = [];

function CreateAccount() {
  const { participantTypes } = useLoaderData() as { participantTypes: ParticipantType[] };
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const navigate = useNavigate();
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

  const onSubmit = async (data: CreateParticipantForm) => {
    const createResult = await CreateParticipant(data, LoggedInUser!.profile);
    if ('errorStatus' in createResult) {
      createResult.messages.forEach((m, i) => {
        setError(`root.serverError-${i}`, {
          message: m,
        });
      });
      return false;
    }
    await loadUser();
    return navigate('/account/pending');
  };

  const handleAccept = () => {
    setValue('agreeToTerms', true);
    setShowTermsDialog(false);
  };
  const watchAccept = watch('agreeToTerms');

  return (
    <div className='create-account-screen'>
      <Card
        title='Participant Information'
        description='Provide the following information about the company/participant you work for.'
      >
        <Suspense fallback={<Loading />}>
          <h2>Participant Information</h2>
          <Await resolve={participantTypes}>
            {(resolvedParticipantTypes: ParticipantType[]) => (
              <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <RootFormErrors fieldErrors={errors}>
                    Something went wrong creating your account. Please review the following error
                    information, and if the problem persists contact support.
                  </RootFormErrors>
                  <TextInput
                    inputName='companyName'
                    label='Participant Name'
                    rules={{ required: 'Please specify participant name.' }}
                  />
                  <CheckboxInput
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
                    <FormStyledCheckbox<CreateParticipantForm, 'agreeToTerms'>
                      disabled={!watchAccept}
                      {...withoutRef(register('agreeToTerms', { required: true }))}
                    />
                    <span>
                      I agree to the{' '}
                      <button
                        type='button'
                        className='text-button'
                        onClick={() => setShowTermsDialog(true)}
                      >
                        Terms and Conditions
                      </button>{' '}
                      (must click link)
                    </span>
                    <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
                      <TermsAndConditions
                        onAccept={handleAccept}
                        onCancel={() => setShowTermsDialog(false)}
                      />
                    </Dialog>
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
                    You’ll receive an email verification. When your email is verified and we’ve
                    approved your account, we’ll send you the account details.
                  </div>
                </form>
              </FormProvider>
            )}
          </Await>
        </Suspense>
      </Card>
    </div>
  );
}
export const CreateAccountRoute: PortalRoute = {
  path: '/account/create',
  description: 'Create account',
  element: <CreateAccount />,
  loader: async () => {
    const participantTypes = GetAllParticipantTypes();
    return defer({ participantTypes });
  },
};
