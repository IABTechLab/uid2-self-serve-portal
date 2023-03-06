/* eslint-disable react/jsx-props-no-spreading */
import { Suspense, useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { ParticipantType } from '../../api/entities/ParticipantType';
import { Card } from '../components/Core/Card';
import { CheckboxInputt } from '../components/Input/CheckboxInput';
import { RadioInput } from '../components/Input/RadioInput';
import { SelectInput } from '../components/Input/SelectInput';
import { TextInput } from '../components/Input/TextInput';
import { GetAllParticipantTypes } from '../services/participantType';
import { CurrentUserContext } from '../services/userAccount';
import { PortalRoute } from './routeTypes';

import './createAccount.scss';

export const AccountCreationRoutes: PortalRoute[] = [];

type FormValues = {
  companyName: string;
  companyLocation: string;
  companyType: number[];
  role: string;
  canSign: boolean;
  signeeEmail: string;
};

function Loading() {
  return <div>Loading participant...</div>;
}
function CreateAccount() {
  // const { LoggedInUser } = useContext(CurrentUserContext);
  const data = useLoaderData() as { participantTypes: ParticipantType[] };

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      companyName: '',
      companyLocation: '',
      companyType: [],
      role: 'user',
    },
  });
  const watchCanSign = watch('canSign');

  const onSubmit: SubmitHandler<FormValues> = (formData) => console.log(formData);

  return (
    <div className='app-panel app-centralize'>
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

            <TextInput control={control} name='companyLocation' label='Company Location' />
            <SelectInput
              control={control}
              name='role'
              label='Your Role'
              options={[
                { optionLabel: 'Admin', value: 'Admin' },
                { optionLabel: 'Developer', value: 'Developer' },
              ]}
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
    </div>
  );
}
export const CreateAccountRoute: PortalRoute = {
  path: '/createAccount',
  description: 'CreateAccount',
  element: <CreateAccount />,
  loader: () => {
    const participantTypes = GetAllParticipantTypes();
    return defer({ participantTypes });
  },
};
