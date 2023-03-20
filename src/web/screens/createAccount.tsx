/* eslint-disable react/jsx-props-no-spreading */
import { Suspense, useContext } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Await, defer, useLoaderData, useNavigate } from 'react-router-dom';

import { ParticipantType } from '../../api/entities/ParticipantType';
import { UserRole } from '../../api/entities/User';
import { Card } from '../components/Core/Card';
import { Form } from '../components/Core/Form';
import { CheckboxInput } from '../components/Input/CheckboxInput';
// import { RadioInput } from '../components/Input/RadioInput';
import { SelectInput } from '../components/Input/SelectInput';
import { TextInput } from '../components/Input/TextInput';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { CreateParticipant, CreateParticipantForm } from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { PortalRoute } from './routeUtils';

export const AccountCreationRoutes: PortalRoute[] = [];

function Loading() {
  return <div>Loading...</div>;
}
function CreateAccount() {
  const { participantTypes } = useLoaderData() as { participantTypes: ParticipantType[] };
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const defaultFormData = {
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
              <TextInput
                inputName='companyName'
                label='Company Name'
                rules={{ required: 'Please specify company name.' }}
              />
              <CheckboxInput
                inputName='companyType'
                label='Company Type'
                options={resolvedParticipantTypes.map((p) => ({
                  optionLabel: p.typeName,
                  value: p.id,
                }))}
                rules={{ required: 'Please specify company type.' }}
              />

              <TextInput
                inputName='officeLocation'
                label='Office Location'
                rules={{ required: 'Please specify office location.' }}
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
            <div className='formMessageContainer'>
              {watchCanSign
                ? 'Great! Once you Request Access you will be presented the UID contract and terms.'
                : 'Before we can grant access to your company, we will need a signed contract and agreement to our terms.\nDo you have an email address for who can sign the UID Contract?'}
            </div>
          )} */}

              {/* {watchCanSign === false && (
                <TextInput inputName='signeeEmail' label='Email for Contract Signee' />
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
