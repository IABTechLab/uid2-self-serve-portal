import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { Dialog } from '../Core/Dialog';
import { TriStateCheckbox } from '../Core/TriStateCheckbox';
import CstgEditDomainDialog from './CstgEditDomainDialog';

type DeleteConfirmationDialogProps = {
  domain: string;
  onRemoveDomain: () => void;
  onOpenChange: () => void;
};

function DeleteConfirmationDialog({
  domain,
  onRemoveDomain,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleRemove = async () => {
    setOpenConfirmation(false);
    await onRemoveDomain();
  };

  return (
    <Dialog
      title='Are you sure you want to delete this domain?'
      open
      onOpenChange={onOpenChange}
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
  onEditDomainName: (newDomainName: string, originalDomainName: string) => void;
  onDelete: () => void;
  checked: boolean;
};

export function CstgDomainItem({
  domain,
  onClick,
  onDelete,
  onEditDomainName,
  checked,
}: CstgDomainItemProps) {
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const onEditDialogChange = () => {
    setShowEditDialog(!showEditDialog);
  };

  const onDeleteDialogChange = () => {
    setShowDeleteDialog(!showDeleteDialog);
  };
  return (
    <tr>
      <td>
        <TriStateCheckbox onClick={onClick} status={checked} />
      </td>
      <td className='domain'>{domain}</td>
      <td className='action'>
        <div className='action-cell'>
          <button
            type='button'
            className='icon-button'
            title='Edit'
            onClick={() => {
              setShowEditDialog(true);
            }}
          >
            <FontAwesomeIcon icon='pencil' />
          </button>
          {showEditDialog && (
            <CstgEditDomainDialog
              domain={domain}
              onEditDomainName={onEditDomainName}
              onOpenChange={onEditDialogChange}
            />
          )}
          <button
            type='button'
            className='icon-button'
            aria-label='delete-domain-name'
            onClick={() => {
              setShowDeleteDialog(true);
            }}
          >
            <FontAwesomeIcon icon='trash-can' />
          </button>
          {showDeleteDialog && (
            <DeleteConfirmationDialog
              domain={domain}
              onRemoveDomain={onDelete}
              onOpenChange={onDeleteDialogChange}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
