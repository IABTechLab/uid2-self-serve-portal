import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { Dialog } from '../Core/Dialog';
import { TriStateCheckbox } from '../Core/TriStateCheckbox';

type DeleteConfirmationDialogProps = {
  domain: string;
  onRemoveDomain: () => void;
};

function DeleteConfirmationDialog({ domain, onRemoveDomain }: DeleteConfirmationDialogProps) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleRemove = async () => {
    setOpenConfirmation(false);
    await onRemoveDomain();
  };

  return (
    <Dialog
      title='Are you sure you want to delete this domain?'
      triggerButton={
        <button type='button' className='icon-button' aria-label='delete-domain-name'>
          <FontAwesomeIcon icon='trash-can' />
        </button>
      }
      open={openConfirmation}
      onOpenChange={setOpenConfirmation}
      closeButtonText='Cancel'
    >
      <ul className='dot-list'>
        <li>{domain}</li>
      </ul>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleRemove}>
          Delete Domain
        </button>
      </div>
    </Dialog>
  );
}

type CstgDomainItemProps = {
  domain: string;
  onClick: () => void;
  onDelete: () => void;
  checked: boolean;
};

export function CstgDomainItem({ domain, onClick, onDelete, checked }: CstgDomainItemProps) {
  return (
    <tr>
      <td>
        <TriStateCheckbox onClick={onClick} status={checked} />
      </td>
      <td className='domain'>{domain}</td>
      <td className='action'>
        <div className='action-cell'>
          <DeleteConfirmationDialog domain={domain} onRemoveDomain={onDelete} />
        </div>
      </td>
    </tr>
  );
}
