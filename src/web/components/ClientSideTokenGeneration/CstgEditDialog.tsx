import { FormProvider, useForm } from 'react-hook-form';

import { Dialog } from '../Core/Dialog/Dialog';
import { RootFormErrors } from '../Input/FormError';
import { TextInput } from '../Input/TextInput';
import {
  CstgValueType,
  EditCstgValuesFormProps,
  extractTopLevelDomain,
  formatCstgValueType,
  validateAppId,
} from './CstgHelper';

type CstgEditDialogProps = Readonly<{
  cstgValue: string;
  existingCstgValues: string[];
  onEdit: (newCstgValue: string, originalCstgValue: string) => Promise<boolean>;
  onOpenChange: () => void;
  cstgValueType: CstgValueType;
}>;

function CstgEditDialog({
  cstgValue,
  onEdit,
  onOpenChange,
  existingCstgValues,
  cstgValueType,
}: CstgEditDialogProps) {
  const formMethods = useForm<EditCstgValuesFormProps>({
    defaultValues: {
      cstgValue,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  const formattedCstgValueType = formatCstgValueType(cstgValueType);

  const showInvalidError = () => {
    setError('root.serverError', {
      type: '400',
      message: `The ${formattedCstgValueType} is invalid.`,
    });
  };

  const onSubmit = async (formData: EditCstgValuesFormProps) => {
    let updatedCstgValue = formData.cstgValue;
    const originalCstgValue = cstgValue;

    if (cstgValueType === CstgValueType.Domain) {
      updatedCstgValue = extractTopLevelDomain(updatedCstgValue);
    }

    if (updatedCstgValue === originalCstgValue) {
      onOpenChange();
    } else if (existingCstgValues.includes(updatedCstgValue)) {
      setError('root.serverError', {
        type: '400',
        message: `The ${formattedCstgValueType} already exists.`,
      });
    }
    if (cstgValueType === CstgValueType.MobileAppId) {
      if (!validateAppId(updatedCstgValue)) {
        showInvalidError();
        return;
      }
    }
    const editSuccess = await onEdit(updatedCstgValue, originalCstgValue);
    if (!editSuccess) {
      showInvalidError();
    }
  };

  return (
    <Dialog
      title={`Edit ${cstgValueType}: ${cstgValue}`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      <RootFormErrors fieldErrors={errors} />
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            inputName='cstgValue'
            label={`${cstgValueType}`}
            rules={{
              required: `Please specify a ${formattedCstgValueType}.`,
            }}
          />
          <div className='form-footer'>
            <button type='submit' className='primary-button'>
              {`Save ${cstgValueType}`}
            </button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default CstgEditDialog;
