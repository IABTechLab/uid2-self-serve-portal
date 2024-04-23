import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormProvider, useForm } from 'react-hook-form';

import { EditDomainFormProps } from '../../services/domainNamesService';
import { Dialog } from '../Core/Dialog';
import { RootFormErrors } from '../Input/FormError';
import { TextInput } from '../Input/TextInput';
import { extractTopLevelDomain, isValidDomain } from './CstgDomainHelper';

type EditDomainDialogProps = Readonly<{
  domain: string;
  existingDomains: string[];
  onEditDomainName: (newDomain: string, originalDomainName: string) => void;
  onOpenChange: () => void;
}>;

function EditDomainDialog({
  domain,
  onEditDomainName,
  onOpenChange,
  existingDomains,
}: EditDomainDialogProps) {
  const formMethods = useForm<EditDomainFormProps>({
    defaultValues: {
      domainName: domain,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  const onSubmit = async (formData: EditDomainFormProps) => {
    const updatedDomainName = formData.domainName;
    const originalDomainName = domain;
    if (!isValidDomain(updatedDomainName)) {
      setError('root.serverError', {
        type: '400',
        message: 'Domain name must be valid.',
      });
      return;
    }
    const updatedTopLevelDomain = extractTopLevelDomain(updatedDomainName);
    if (updatedTopLevelDomain === originalDomainName) {
      onOpenChange();
    } else if (existingDomains.includes(updatedTopLevelDomain)) {
      setError('root.serverError', {
        type: '400',
        message: 'Domain name already exists.',
      });
    } else {
      onEditDomainName(updatedTopLevelDomain, originalDomainName);
    }
  };

  return (
    <Dialog
      title={`Edit Domain: ${domain}`}
      triggerButton={
        <button type='button' className='icon-button' title='Edit'>
          <FontAwesomeIcon icon='pencil' />
        </button>
      }
      open
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      <RootFormErrors fieldErrors={errors} />
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            inputName='domainName'
            label='Domain Name'
            rules={{
              required: 'Please specify domain name.',
            }}
          />
          <div className='form-footer'>
            <button type='submit' className='primary-button'>
              Save Domain
            </button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default EditDomainDialog;
