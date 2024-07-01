import { Dialog } from '../Core/Popups/Dialog';
import { CstgValueType } from './CstgHelper';

import './CstgDeleteDialog.scss';

type DeleteConfirmationDialogProps = Readonly<{
  cstgValues: string[];
  onRemoveCstgValues: () => void;
  onOpenChange: () => void;
  cstgValueType: CstgValueType;
}>;

function DeleteConfirmationDialog({
  cstgValues,
  onRemoveCstgValues,
  onOpenChange,
  cstgValueType,
}: DeleteConfirmationDialogProps) {
  const handleRemove = () => {
    onRemoveCstgValues();
  };

  return (
    <Dialog
      title={`Are you sure you want to delete ${
        cstgValues.length > 1
          ? `these ${cstgValueType.toLowerCase()}s`
          : `this ${cstgValueType.toLowerCase()}`
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
          {`Delete ${cstgValueType}${cstgValues.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
