/* eslint-disable react/jsx-props-no-spreading */
import { Suspense, useContext } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Await, defer, useLoaderData, useNavigate } from 'react-router-dom';

import { ParticipantType } from '../../api/entities/ParticipantType';
import { UserRole } from '../../api/entities/User';
import { Card } from '../components/Core/Card';
import { Form } from '../components/Core/Form';
import { Loading } from '../components/Core/Loading';
import { CheckboxInput } from '../components/Input/CheckboxInput';
// import { RadioInput } from '../components/Input/RadioInput';
import { SelectInput } from '../components/Input/SelectInput';
import { TextInput } from '../components/Input/TextInput';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { CreateParticipant, CreateParticipantForm } from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { PortalRoute } from './routeUtils';

export const AccountCreationRoutes: PortalRoute[] = [];

function CreateAccount() {
  const { participantTypes } = useLoaderData() as { participantTypes: ParticipantType[] };
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const defaultFormData = {
    companyName: '',
    companyType: [],
    officeLocation: '',
    role: 'user',
    canSign: true,
  };

  const onSubmitCallback = async () => {
    await loadUser();
    navigate('/account/pending');
  };
  const onSubmit: SubmitHandler<CreateParticipantForm> = async (formData) => {
    return CreateParticipant(formData, LoggedInUser!.profile);
  };

  return (
    <Card
      title='Create Account'
      description='No worries, this isn’t set in stone. You can update these sections at anytime moving forward. '
    >
      <Suspense fallback={<Loading />}>
        <h3>Company Information</h3>
        <Await resolve={participantTypes}>
          {(resolvedParticipantTypes: ParticipantType[]) => (
            <Form<CreateParticipantForm>
              onSubmit={onSubmit}
              onSubmitCallback={onSubmitCallback}
              defaultValues={defaultFormData}
              submitButtonText='Create Account'
            >
              {/* We passing control in props to differentiate this is a form input component  */}
              <TextInput name='companyName' label='Company Name' control={undefined} />
              <CheckboxInput
                name='companyType'
                label='Company Type'
                control={undefined}
                options={resolvedParticipantTypes.map((p) => ({
                  optionLabel: p.typeName,
                  value: p.id,
                }))}
              />

              <TextInput name='officeLocation' label='Office Location' control={undefined} />
              <SelectInput
                control={undefined}
                name='role'
                label='Job Function'
                options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
                  optionLabel: UserRole[key],
                  value: UserRole[key],
                }))}
              />
              {/* Contract Sign will be introduced in phase 2 */}
              {/* <RadioInput
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
          )} */}

              {/* {watchCanSign === false && (
                <TextInput name='signeeEmail' label='Email for Contract Signee' />
              )} */}
            </Form>
          )}
        </Await>
      </Suspense>
    </Card>
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
