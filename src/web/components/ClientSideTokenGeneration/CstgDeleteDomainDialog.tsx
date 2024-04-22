import { Dialog } from '../Core/Dialog';

import './CstgDeleteDomainDialog.scss';

type DeleteConfirmationDialogProps = Readonly<{
  domain: string;
  onRemoveDomain: () => void;
  onOpenChange: () => void;
}>;

function DeleteConfirmationDialog({
  domain,
  onRemoveDomain,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const handleRemove = () => {
    onRemoveDomain();
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

export default DeleteConfirmationDialog;
