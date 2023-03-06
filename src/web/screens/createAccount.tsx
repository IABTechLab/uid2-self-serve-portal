/* eslint-disable react/jsx-props-no-spreading */
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

import { Card } from '../components/Core/Card';
import { CurrentUserContext } from '../services/userAccount';
import { PortalRoute } from './routeTypes';

export const AccountCreationRoutes: PortalRoute[] = [];

function CreateAccount() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const {
    register,
    // onSubmit,
    handleSubmit,
    // control,
    // submissionId,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      'company-name': '',
      'company-type': [],
      'company-location': '',
      role: '',
      'can-sign': '',
    },
  });
  const onSubmit = (data) => console.log(data);
  console.log(errors);
  // useEffect(() => {
  //   console.log('create account here');
  //   if (LoggedInUser?.user) {
  //   }
  // }, []);
  return (
    <div className='app-panel app-centralize'>
      <Card
        title='Create Account'
        description='No worries, this isn’t set in stone. You can update these sections at anytime moving forward. '
      >
        <form onSubmit={onSubmit}>
          {errors.root?.serverError && <p>Something went wrong, and please try again.</p>}
          <div>
            <label>
              <span>Company Name</span>
              <input
                {...register('company-name', {
                  required: true,
                })}
                aria-invalid={errors['company-name'] ? 'true' : 'false'}
                type='text'
              />
            </label>
            {errors['company-name'] && <p role='alert'>{errors['company-name']?.message}</p>}
          </div>

          <div>
            <p>Company Type</p>
            {[
              { label: 'Advertiser', value: 'Advertiser' },
              { label: 'Publisher', value: 'Publisher' },
              { label: 'Data Provider', value: 'Data Provider' },
              { label: 'DSP', value: 'DSP' },
            ].map(({ label, value }, index) => {
              return (
                <label key={value + index}>
                  <span>{label}</span>
                  <input
                    {...register('company-type', {
                      required: true,
                    })}
                    aria-invalid={errors['company-type'] ? 'true' : 'false'}
                    value={value}
                    type='checkbox'
                  />
                </label>
              );
            })}
            {errors['company-type'] && <p role='alert'>{errors['company-type']?.message}</p>}
          </div>

          <div>
            <label>
              <span>Company Location</span>
              <input {...register('company-location')} type='text' />
            </label>
          </div>

          <div>
            <label>
              <span>Your Role</span>
              <select {...register('role')}>
                <option value='Admin'>Admin</option>
                <option value='Developer'>Developer</option>
              </select>
            </label>
          </div>

          <div>
            <p>Do you have the ability to sign a contract for UID Integration</p>
            {[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ].map(({ label, value }, index) => {
              return (
                <label key={value + index}>
                  <span>{label}</span>
                  <input
                    {...register('can-sign')}
                    aria-invalid={errors['can-sign'] ? 'true' : 'false'}
                    value={value}
                    type='radio'
                  />
                </label>
              );
            })}
            {errors['can-sign'] && <p role='alert'>{errors['can-sign']?.message}</p>}
          </div>

          <button disabled={isSubmitting}>Create Account</button>
        </form>
      </Card>
    </div>
  );
}
export const CreateAccountRoute: PortalRoute = {
  path: '/createAccount',
  description: 'CreateAccount',
  element: <CreateAccount />,
};
