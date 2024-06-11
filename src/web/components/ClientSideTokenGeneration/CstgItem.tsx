import { useState } from 'react';

import ActionButton from '../Core/ActionButton';
import { TriStateCheckbox } from '../Core/TriStateCheckbox';
import CstgDeleteDialog from './CstgDeleteDialog';
import CstgEditDialog from './CstgEditDialog';
import { CstgValue } from './CstgHelper';

type CstgItemProps = Readonly<{
  cstgValue: string;
  existingCstgValues: string[];
  onClick: () => void;
  onEdit: (newCstgValue: string, originalCstgValue: string) => Promise<boolean>;
  onDelete: () => void;
  checked: boolean;
  cstgValueName: CstgValue;
}>;

export function CstgItem({
  cstgValue,
  existingCstgValues,
  onClick,
  onDelete,
  onEdit,
  checked,
  cstgValueName,
}: CstgItemProps) {
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
      <td className='cstg-value'>{cstgValue}</td>
      <td className='action'>
        <div className='action-cell'>
          <ActionButton onClick={onEditDialogChange} icon='pencil' />
          {showEditDialog && (
            <CstgEditDialog
              cstgValue={cstgValue}
              existingCstgValues={existingCstgValues}
              onEdit={onEdit}
              onOpenChange={onEditDialogChange}
              cstgValueName={cstgValueName}
            />
          )}

          <ActionButton onClick={() => setShowDeleteDialog(true)} icon='trash-can' />
          {showDeleteDialog && (
            <CstgDeleteDialog
              cstgValues={[cstgValue]}
              onRemoveCstgValues={onDelete}
              onOpenChange={onDeleteDialogChange}
              cstgValueName={cstgValueName}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
