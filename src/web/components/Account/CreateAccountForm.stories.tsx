import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { CreateAccountForm, CreateAccountFormProps } from './CreateAccountForm';

const meta: Meta<typeof CreateAccountForm> = {
  title: 'Forms/CreateAccount',
  component: CreateAccountForm,
};

export default meta;

const participantTypes = [
  {
    id: 1,
    typeName: 'DSP',
  },
  {
    id: 2,
    typeName: 'Advertiser',
  },
  {
    id: 3,
    typeName: 'Data Provider',
  },
  {
    id: 4,
    typeName: 'Publisher',
  },
];

type CreateAccountStoryProps = Partial<Pick<CreateAccountFormProps, 'onSubmit'>>;
const CreateAccountStory = ({ onSubmit }: CreateAccountStoryProps) => {
  const [formData, setFormData] = useState<string | null>();
  return (
    <>
      <div style={{ maxWidth: '660px' }} className='create-account-screen'>
        <CreateAccountForm
          // eslint-disable-next-line consistent-return
          onSubmit={async (data) => {
            setFormData(JSON.stringify(data));
            if (onSubmit) return onSubmit(data);
          }}
          resolvedParticipantTypes={participantTypes}
        />
      </div>
      {!!formData && (
        <div>
          <h1>Submitted form data:</h1>
          <div>{formData}</div>
        </div>
      )}
    </>
  );
};

export const SubmitSucceeds: StoryFn<typeof CreateAccountForm> = () => <CreateAccountStory />;
export const SubmitFailsWithErrors: StoryFn<typeof CreateAccountForm> = () => (
  <CreateAccountStory
    onSubmit={async () => ['There was a server error', 'There was a second server error']}
  />
);
