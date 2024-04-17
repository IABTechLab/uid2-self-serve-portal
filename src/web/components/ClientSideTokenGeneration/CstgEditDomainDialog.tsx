import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubmitHandler } from 'react-hook-form';

import { EditDomainFormProps } from '../../services/domainNamesService';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { TextInput } from '../Input/TextInput';

type EditDomainDialogProps = {
  domain: string;
  onEditDomainName: (newDomainName: string, originalDomainName: string) => void;
  onOpenChange: () => void;
};

function EditDomainDialog({ domain, onEditDomainName, onOpenChange }: EditDomainDialogProps) {
  const defaultValues = {
    domainName: domain,
  };

  const onSubmit: SubmitHandler<EditDomainFormProps> = async (formData) => {
    const newDomainName = formData.domainName;
    const originalDomainName = defaultValues.domainName;
    await onEditDomainName(newDomainName, originalDomainName);
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
      <Form<EditDomainFormProps>
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        submitButtonText='Save Domain'
      >
        <TextInput
          inputName='domainName'
          label='Domain Name'
          rules={{
            required: 'Please specify domain name.',
          }}
        />
      </Form>
    </Dialog>
  );
}

export default EditDomainDialog;
