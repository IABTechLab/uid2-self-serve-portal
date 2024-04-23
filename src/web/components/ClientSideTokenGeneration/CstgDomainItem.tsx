import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { TriStateCheckbox } from '../Core/TriStateCheckbox';
import CstgDeleteDomainConfirmationDialog from './CstgDeleteDomainDialog';
import CstgEditDomainDialog from './CstgEditDomainDialog';

type CstgDomainItemProps = Readonly<{
  domain: string;
  existingDomains: string[];
  onClick: () => void;
  onEditDomain: (newDomainName: string, originalDomainName: string) => void;
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
              existingDomains={existingDomains}
              onEditDomainName={onEditDomain}
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
            <CstgDeleteDomainConfirmationDialog
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
