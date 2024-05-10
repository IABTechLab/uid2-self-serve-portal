import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import DeleteButton from '../Core/DeleteButton';
import EditButton from '../Core/EditButton';
import { TriStateCheckbox } from '../Core/TriStateCheckbox';
import CstgDeleteDomainDialog from './CstgDeleteDomainDialog';
import CstgEditDomainDialog from './CstgEditDomainDialog';

type CstgDomainItemProps = Readonly<{
  domain: string;
  existingDomains: string[];
  onClick: () => void;
  onEditDomain: (newDomain: string, originalDomainName: string) => void;
  onDelete: () => void;
  checked: boolean;
}>;

export function CstgDomainItem({
  domain,
  existingDomains,
  onClick,
  onDelete,
  onEditDomain,
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
          <EditButton onClick={onEditDialogChange} />
          {showEditDialog && (
            <CstgEditDomainDialog
              domain={domain}
              existingDomains={existingDomains}
              onEditDomainName={onEditDomain}
              onOpenChange={onEditDialogChange}
            />
          )}

          <DeleteButton onClick={() => setShowDeleteDialog(true)} />
          {showDeleteDialog && (
            <CstgDeleteDomainDialog
              domains={[domain]}
              onRemoveDomains={onDelete}
              onOpenChange={onDeleteDialogChange}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
