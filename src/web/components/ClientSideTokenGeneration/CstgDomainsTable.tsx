import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useState } from 'react';

import { Dialog } from '../Core/Dialog';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import { CstgDomainItem } from './CstgDomain';

import './CstgDomainsTable.scss';

type CstgNewDomainRowProps = {
  onAdd: (newDomain: string) => Promise<void>;
};

function CstgNewDomainRow({ onAdd }: CstgNewDomainRowProps) {
  const [newDomain, setNewDomain] = useState<string>('');
  return (
    <tr>
      <td />
      <td className='domain'>
        <input
          className='input-container'
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
        />
      </td>
      <td className='action'>
        <div className='action-cell'>
          <button type='button' className='transparent-button' onClick={() => onAdd(newDomain)}>
            Save
          </button>
        </div>
      </td>
    </tr>
  );
}

type DeleteDomainDialogProps = {
  onDeleteDomains: () => void;
  selectedDomains: string[];
};
function DeleteDomainDialog({ onDeleteDomains, selectedDomains }: DeleteDomainDialogProps) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleDeleteDomain = () => {
    onDeleteDomains();
    setOpenConfirmation(false);
  };

  return (
    <Dialog
      title='Are you sure you want to delete these domains?'
      triggerButton={
        <button className='transparent-button table-action-button' type='button'>
          <FontAwesomeIcon icon={['far', 'trash-can']} className='cstg-domains-management-icon' />
          Delete Domains
        </button>
      }
      open={openConfirmation}
      onOpenChange={setOpenConfirmation}
    >
      <div className='dialog-body-section'>
        <ul className='dot-list'>
          {selectedDomains.map((domain) => (
            <li key={domain}>{domain}</li>
          ))}
        </ul>
      </div>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleDeleteDomain}>
          Delete Domains
        </button>
        <button
          type='button'
          className='transparent-button'
          onClick={() => setOpenConfirmation(false)}
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
}

type CstgDomainsTableProps = {
  domains: string[];
  onUpdateDomains: (domains: string[]) => Promise<void>;
};

export function CstgDomainsTable({ domains, onUpdateDomains }: CstgDomainsTableProps) {
  const [showNewRow, setShowNewRow] = useState<boolean>(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const isSelectedAll = domains.length && domains.every((d) => selectedDomains.includes(d));
  const getCheckboxStatus = () => {
    if (isSelectedAll) {
      return TriStateCheckboxState.checked;
    }
    if (selectedDomains.length > 0) {
      return TriStateCheckboxState.indeterminate as CheckedState;
    }
    return TriStateCheckboxState.unchecked;
  };

  const checkboxStatus = getCheckboxStatus();

  const handleCheckboxChange = () => {
    if (checkboxStatus === TriStateCheckboxState.unchecked) {
      setSelectedDomains(domains);
    } else {
      setSelectedDomains([]);
    }
  };
  const isDomainSelected = (domain: string) => selectedDomains.includes(domain);

  const handleBulkDeleteDomains = (deleteDomains: string[]) => {
    onUpdateDomains(domains.filter((domain) => !deleteDomains.includes(domain)));
  };

  const handleSelectDomain = (domain: string) => {
    if (isDomainSelected(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const onAddRow = () => {
    setShowNewRow(true);
  };

  const handleAddNewDomain = async (newDomain: string) => {
    await onUpdateDomains([...domains, newDomain]);
    setShowNewRow(false);
  };

  return (
    <div className='cstg-domains-management'>
      <h2>Top-level Domains</h2>
      <div className='table-actions'>
        <TriStateCheckbox onClick={handleCheckboxChange} status={checkboxStatus} />
        {selectedDomains.length > 0 && (
          <DeleteDomainDialog
            onDeleteDomains={() => handleBulkDeleteDomains(selectedDomains)}
            selectedDomains={selectedDomains}
          />
        )}
        <button
          className='transparent-button table-action-button'
          type='button'
          disabled={showNewRow}
          onClick={onAddRow}
        >
          <FontAwesomeIcon icon='plus' className='cstg-domains-management-icon' />
          Add Domain
        </button>
      </div>
      <table className='cstg-domains-table'>
        <thead>
          <tr>
            <th> </th>
            <th className='domain'>Domain</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {domains.map((domain) => (
            <CstgDomainItem
              key={domain}
              domain={domain}
              onClick={() => handleSelectDomain(domain)}
              onDelete={() => handleBulkDeleteDomains([domain])}
              checked={isDomainSelected(domain)}
            />
          ))}
          {showNewRow && <CstgNewDomainRow onAdd={(newDomain) => handleAddNewDomain(newDomain)} />}
        </tbody>
      </table>
      {!domains.length && !showNewRow && (
        <TableNoDataPlaceholder
          icon={<img src='/group-icon.svg' alt='group-icon' />}
          title='No Approved Domains'
        >
          <span>There are no approved domains.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}
