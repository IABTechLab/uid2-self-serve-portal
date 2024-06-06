import { useState } from 'react';

import ActionButton from '../../Core/ActionButton';
import { TriStateCheckbox } from '../../Core/TriStateCheckbox';
import CstgDeleteAppIdDialog from './CstgDeleteAppIdDialog';
import CstgEditAppIdDialog from './CstgEditAppIdDialog';

type CstgAppIdItemProps = Readonly<{
  appId: string;
  existingAppIds: string[];
  onClick: () => void;
  onEditAppId: (newDomain: string, originalDomainName: string) => Promise<boolean>;
  onDelete: () => void;
  checked: boolean;
}>;

export function CstgAppIdItem({
  appId,
  existingAppIds,
  onClick,
  onDelete,
  onEditAppId,
  checked,
}: CstgAppIdItemProps) {
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
      <td className='app-id'>{appId}</td>
      <td className='action'>
        <div className='action-cell'>
          <ActionButton onClick={onEditDialogChange} icon='pencil' />
          {showEditDialog && (
            <CstgEditAppIdDialog
              appId={appId}
              existingAppIds={existingAppIds}
              onEditAppId={onEditAppId}
              onOpenChange={onEditDialogChange}
            />
          )}

          <ActionButton onClick={() => setShowDeleteDialog(true)} icon='trash-can' />
          {showDeleteDialog && (
            <CstgDeleteAppIdDialog
              appIds={[appId]}
              onRemoveAppIds={onDelete}
              onOpenChange={onDeleteDialogChange}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
