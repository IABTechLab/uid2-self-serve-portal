/* eslint-disable react/jsx-props-no-spreading */
import { Suspense, useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Await, defer, useLoaderData, useNavigate } from 'react-router-dom';

import { ParticipantType } from '../../api/entities/ParticipantType';
import { UserRole } from '../../api/entities/User';
import { Card } from '../components/Core/Card';
import { CheckboxInputt } from '../components/Input/CheckboxInput';
import { RadioInput } from '../components/Input/RadioInput';
import { SelectInput } from '../components/Input/SelectInput';
import { TextInput } from '../components/Input/TextInput';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { CreateParticipant, CreateParticipantForm } from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { PortalRoute } from './routeTypes';

import './createAccount.scss';

export const AccountCreationRoutes: PortalRoute[] = [];

function Loading() {
  return <div>Loading...</div>;
}
function CreateAccount() {
  const data = useLoaderData() as { participantTypes: ParticipantType[] };
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateParticipantForm>({
    defaultValues: {
      companyName: '',
      companyType: [],
      officeLocation: '',
      role: 'user',
      canSign: true,
    },
  });
  const watchCanSign = watch('canSign');

  const onSubmit: SubmitHandler<CreateParticipantForm> = async (formData) => {
    await CreateParticipant(formData, LoggedInUser!.profile);
    await loadUser();
    navigate('/account/pending');
  };

  return (
    <Card
      title='Create Account'
      description='No worries, this isn’t set in stone. You can update these sections at anytime moving forward. '
    >
      <Suspense fallback={<Loading />}>
        <h3>Company Information</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.root?.serverError && <p>Something went wrong, and please try again.</p>}
          <TextInput control={control} name='companyName' label='Company Name' />
          <Await resolve={data.participantTypes}>
            {(participantTypes: ParticipantType[]) => (
              <CheckboxInputt
                control={control}
                name='companyType'
                label='Company Type'
                options={participantTypes.map((p) => ({
                  optionLabel: p.typeName,
                  value: p.id,
                }))}
              />
            )}
          </Await>

          <TextInput control={control} name='officeLocation' label='Office Location' />
          <SelectInput
            control={control}
            name='role'
            label='Your Role'
            options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
              optionLabel: UserRole[key],
              value: UserRole[key],
            }))}
          />
          <RadioInput
            name='canSign'
            label='Do you have the ability to sign a contract for UID Integration'
            options={[
              { optionLabel: 'Yes', value: true },
              { optionLabel: 'No', value: false },
            ]}
            aria-invalid={errors.canSign ? 'true' : 'false'}
            control={control}
          />
          {typeof watchCanSign == 'boolean' && (
            <div className='formMessageContainer'>
              {watchCanSign
                ? 'Great! Once you Request Access you will be presented the UID contract and terms.'
                : 'Before we can grant access to your company, we will need a signed contract and agreement to our terms.\nDo you have an email address for who can sign the UID Contract?'}
            </div>
          )}

          {watchCanSign === false && (
            <TextInput control={control} name='signeeEmail' label='Email for Contract Signee' />
          )}
          <div className='formFooter'>
            <button type='submit' disabled={isSubmitting} className='primaryButton largeButton'>
              Create Account
            </button>
          </div>
        </form>
      </Suspense>
    </Card>
  );
}
export const CreateAccountRoute: PortalRoute = {
  path: '/account/create',
  description: 'Create account',
  element: <CreateAccount />,
  loader: () => {
    const participantTypes = GetAllParticipantTypes();
    return defer({ participantTypes });
  },
};
