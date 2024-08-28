import { Dialog } from '../Core/Dialog/Dialog';
import { CstgValueType, formatCstgValueType } from './CstgHelper';

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
  const formattedCstgValueType = formatCstgValueType(cstgValueType);

  return (
    <Dialog
      title={`Are you sure you want to delete ${
        cstgValues.length > 1
          ? `these ${formattedCstgValueType}s`
          : `this ${formattedCstgValueType}`
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
