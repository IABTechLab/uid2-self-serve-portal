import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { parse } from 'tldts';

import { EditDomainFormProps } from '../../services/domainNamesService';
import { Dialog } from '../Core/Dialog';
import { Form } from '../Core/Form';
import { InlineMessage } from '../Core/InlineMessage';
import { TextInput } from '../Input/TextInput';
import { isValidDomain } from './CstgDomainHelper';

type EditDomainDialogProps = Readonly<{
  domain: string;
  existingDomains: string[];
  onEditDomainName: (newDomainName: string, originalDomainName: string) => void;
  onOpenChange: () => void;
}>;

function EditDomainDialog({
  domain,
  onEditDomainName,
  onOpenChange,
  existingDomains,
}: EditDomainDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const defaultValues = {
    domainName: domain,
  };

  const onSubmit: SubmitHandler<EditDomainFormProps> = (formData) => {
    const updatedDomainName = formData.domainName;

    if (!isValidDomain(updatedDomainName)) {
      setErrorMessage('Domain name must be valid.');
    } else if (existingDomains.includes(updatedDomainName)) {
      setErrorMessage('Domain name already exists.');
    } else {
      const originalDomainName = defaultValues.domainName;
      onEditDomainName(updatedDomainName, originalDomainName);
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
      {!!errorMessage && <InlineMessage message={errorMessage} type='Error' />}
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
