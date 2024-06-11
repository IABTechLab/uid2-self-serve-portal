import { Dialog } from '../Core/Dialog';
import { CstgValue } from './CstgHelper';

import './CstgDeleteDialog.scss';

type DeleteConfirmationDialogProps = Readonly<{
  cstgValues: string[];
  onRemoveCstgValues: () => void;
  onOpenChange: () => void;
  cstgValueName: CstgValue;
}>;

function DeleteConfirmationDialog({
  cstgValues,
  onRemoveCstgValues,
  onOpenChange,
  cstgValueName,
}: DeleteConfirmationDialogProps) {
  const handleRemove = () => {
    onRemoveCstgValues();
  };

  return (
    <Dialog
      title={`Are you sure you want to delete ${
        cstgValues.length > 1
          ? `these ${cstgValueName.toLowerCase()}s`
          : `this ${cstgValueName.toLowerCase()}`
      }?`}
      onOpenChange={onOpenChange}
      closeButtonText='Cancel'
    >
      <ul className='dot-list'>
        {cstgValues.map((cstgValue) => (
          <li key={cstgValue}>{cstgValue}</li>
        ))}
      </ul>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleRemove}>
          {`Delete ${cstgValueName}${cstgValues.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
