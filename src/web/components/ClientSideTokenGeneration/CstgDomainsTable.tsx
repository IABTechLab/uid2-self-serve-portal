import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useState } from 'react';

import { Dialog } from '../Core/Dialog';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';

import './CstgDomainsTable.scss';

function NoApprovedDomains() {
  return (
    <div className='no-participant-requests-container'>
      <img src='/group-icon.svg' alt='group-icon' />
      <div className='no-participant-requests-text'>
        <h2>No Approved Domains</h2>
        <span>There are no approved domains.</span>
      </div>
    </div>
  );
}

type CstgDomainItemProps = {
  domain: string;
  onClick: () => void;
  onDelete: () => void;
  onAdd: (newDomain: string) => void;
  checked: boolean;
};

function CstgDomainItem({ domain, onClick, onDelete, onAdd, checked }: CstgDomainItemProps) {
  const [newDomain, setNewDomain] = useState('');
  const isNewRow = domain === '';
  return (
    <tr>
      <td>{!isNewRow && <TriStateCheckbox onClick={onClick} status={checked} />}</td>
      <td>
        {isNewRow ? (
          <input
            className='input-container'
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
          />
        ) : (
          domain
        )}
      </td>
      <td className='action'>
        <div className='action-cell'>
          {isNewRow ? (
            <button type='button' className='transparent-button' onClick={() => onAdd(newDomain)}>
              Save
            </button>
          ) : (
            <button type='button' className='transparent-button' onClick={onDelete}>
              Delete
            </button>
          )}
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
      title='Are you sure you want to delete these permissions?'
      triggerButton={
        <button className='transparent-button cstg-domains-management-delete-button' type='button'>
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
  const [tableData, setTableData] = useState<string[]>(domains);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const isSelectedAll = tableData.filter((r) => r !== '').every((d) => selectedDomains.includes(d));
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
      setSelectedDomains(tableData.filter((r) => r !== ''));
    } else {
      setSelectedDomains([]);
    }
  };
  const isDomainSelected = (domain: string) => selectedDomains.includes(domain);

  const handleBulkDeleteDomains = (deleteDomains: string[]) => {
    onUpdateDomains(domains.filter((domain) => deleteDomains.includes(domain)));
  };

  const handleDeleteDomain = async (deleteDomain: string, index: number) => {
    await onUpdateDomains(tableData.filter((domain) => domain !== deleteDomain && domain !== ''));
    const newTableData = [...tableData];
    newTableData.splice(index, 1);
    setTableData(newTableData);
  };

  const handleSelectDomain = (domain: string) => {
    if (isDomainSelected(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const onAddRow = () => {
    setTableData([...tableData, '']);
  };

  const handleAddNewDomain = (newDomain: string, index: number) => {
    onUpdateDomains([...tableData.filter((r) => r !== ''), newDomain]);
    const newTableData = [...tableData];
    newTableData[index] = newDomain;
    setTableData(newTableData);
  };

  return (
    <div className='cstg-domains-management'>
      <h2>Top-level Domains</h2>
      <div className='cstg-domains-management-actions'>
        <TriStateCheckbox onClick={handleCheckboxChange} status={checkboxStatus} />
        {selectedDomains.length > 0 && (
          <DeleteDomainDialog
            onDeleteDomains={() => handleBulkDeleteDomains(selectedDomains)}
            selectedDomains={selectedDomains}
          />
        )}
        <button
          className='transparent-button cstg-domains-management-delete-button'
          type='button'
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
            <th>Domain</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((domain, index) => (
            <CstgDomainItem
              domain={domain}
              onAdd={(newDomain) => handleAddNewDomain(newDomain, index)}
              onClick={() => handleSelectDomain(domain)}
              onDelete={() => handleDeleteDomain(domain, index)}
              checked={isDomainSelected(domain)}
            />
          ))}
        </tbody>
      </table>
      {!tableData.length && <NoApprovedDomains />}
    </div>
  );
}
