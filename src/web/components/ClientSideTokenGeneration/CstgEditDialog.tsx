import { FormProvider, useForm } from 'react-hook-form';

import { Dialog } from '../Core/Dialog';
import { RootFormErrors } from '../Input/FormError';
import { TextInput } from '../Input/TextInput';
import { CstgValueType, EditCstgValuesFormProps, extractTopLevelDomain } from './CstgHelper';

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
        message: `${cstgValueType} already exists.`,
      });
    } else {
      const editSuccess = await onEdit(updatedCstgValue, originalCstgValue);
      if (!editSuccess) {
        setError('root.serverError', {
          type: '400',
          message: `Edited value is an invalid ${cstgValueType}.`,
        });
      }
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
              required: `Please specify ${cstgValueType}.`,
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
