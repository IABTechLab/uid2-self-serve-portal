import { Dialog } from '../Core/Dialog';

import './CstgDeleteDomainDialog.scss';

type DeleteConfirmationDialogProps = Readonly<{
  domains: string[];
  onRemoveDomains: () => void;
  onOpenChange: () => void;
}>;

function DeleteConfirmationDialog({
  domains,
  onRemoveDomains,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const handleRemove = () => {
    onRemoveDomains();
  };

  return (
    <Dialog
      title={`Are you sure you want to delete ${
        domains.length > 1 ? 'these domains' : 'this domain'
      }?`}
      open
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      <ul className='dot-list'>
        {domains.map((domain) => (
          <li key={domain}>{domain}</li>
        ))}
      </ul>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleRemove}>
          {`Delete Domain${domains.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
