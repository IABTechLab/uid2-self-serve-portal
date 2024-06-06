import { Dialog } from '../../Core/Dialog';

import '../Domains/CstgDeleteDomainDialog.scss';

type DeleteConfirmationDialogProps = Readonly<{
  appIds: string[];
  onRemoveAppIds: () => void;
  onOpenChange: () => void;
}>;

function DeleteConfirmationDialog({
  appIds,
  onRemoveAppIds,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const handleRemove = () => {
    onRemoveAppIds();
  };

  return (
    <Dialog
      title={`Are you sure you want to delete ${
        appIds.length > 1 ? 'these mobile app ids' : 'this mobile app id'
      }?`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      <ul className='dot-list'>
        {appIds.map((appId) => (
          <li key={appId}>{appId}</li>
        ))}
      </ul>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleRemove}>
          {`Delete Mobile App ID${appIds.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
