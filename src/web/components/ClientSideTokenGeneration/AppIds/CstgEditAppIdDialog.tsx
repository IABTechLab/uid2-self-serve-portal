import { FormProvider, useForm } from 'react-hook-form';

import { EditAppIdFormProps } from '../../../services/appIdsService';
import { Dialog } from '../../Core/Dialog';
import { RootFormErrors } from '../../Input/FormError';
import { TextInput } from '../../Input/TextInput';
import { validateAppIds } from '../CstgHelper';

type EditAppIdDialogProps = Readonly<{
  appId: string;
  existingAppIds: string[];
  onEditAppId: (newAppId: string, originalAppId: string) => Promise<boolean>;
  onOpenChange: () => void;
}>;

function EditAppIdDialog({
  appId,
  onEditAppId,
  onOpenChange,
  existingAppIds,
}: EditAppIdDialogProps) {
  const formMethods = useForm<EditAppIdFormProps>({
    defaultValues: {
      appId,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  const onSubmit = async (formData: EditAppIdFormProps) => {
    const updatedAppId = formData.appId;
    const originalAppId = appId;
    if (updatedAppId === originalAppId) {
      onOpenChange();
    } else if (existingAppIds.includes(updatedAppId)) {
      setError('root.serverError', {
        type: '400',
        message: 'Mobile app id already exists.',
      });
    } else {
      const isEditedAppIdValid = validateAppIds([updatedAppId]);
      if (isEditedAppIdValid.length > 0) {
        setError('root.serverError', {
          type: '400',
          message: 'Edited mobile app id is an invalid id type.',
        });
      } else {
        await onEditAppId(updatedAppId, originalAppId);
      }
    }
  };

  return (
    <Dialog
      title={`Edit Mobile App ID: ${appId}`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      <RootFormErrors fieldErrors={errors} />
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            inputName='appId'
            label='Mobile App ID'
            rules={{
              required: 'Please specify mobile app id.',
            }}
          />
          <div className='form-footer'>
            <button type='submit' className='primary-button'>
              Save Mobile App ID
            </button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default EditAppIdDialog;
