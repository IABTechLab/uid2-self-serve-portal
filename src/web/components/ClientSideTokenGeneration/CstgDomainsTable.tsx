import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useState } from 'react';

import { AddDomainNamesFormProps } from '../../services/domainNamesService';
import { Dialog } from '../Core/Dialog';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import CstgAddDomainDialog from './CstgAddDomainDialog';
import { CstgDomainItem } from './CstgDomain';

import './CstgDomainsTable.scss';

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

type CstgDomainsTableProps = Readonly<{
  domains: string[];
  onUpdateDomains: (domains: string[]) => Promise<void>;
  onAddDomains: (newDomainNamesFormatted: string[]) => Promise<void>;
}>;

export function CstgDomainsTable({
  domains,
  onUpdateDomains,
  onAddDomains,
}: CstgDomainsTableProps) {
  const [showNewRow, setShowNewRow] = useState<boolean>(false);
  const [showAddDomainsDialog, setShowAddDomainsDialog] = useState<boolean>(false);
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

  const onOpenChangeAddDomainDialog = () => {
    setShowAddDomainsDialog(!showAddDomainsDialog);
  };

  const onSubmitAddDomainDialog = async (newDomainNamesFormatted: string[]) => {
    await onAddDomains(newDomainNamesFormatted);
    setShowAddDomainsDialog(false);
  };

  return (
    <div className='cstg-domains-management'>
      <div className='cstg-domains-table-header'>
        <div>
          <h2>Top-Level Domains</h2>
          {domains?.length > 0 && (
            <div className='table-actions'>
              <TriStateCheckbox onClick={handleCheckboxChange} status={checkboxStatus} />

              {selectedDomains.length > 0 && (
                <DeleteDomainDialog
                  onDeleteDomains={() => handleBulkDeleteDomains(selectedDomains)}
                  selectedDomains={selectedDomains}
                />
              )}
            </div>
          )}
        </div>
        <div className='cstg-domains-table-header-right'>
          <div className='add-domain-button'>
            <button className='small-button' type='button' onClick={onOpenChangeAddDomainDialog}>
              Add Domain
            </button>
            {showAddDomainsDialog && (
              <CstgAddDomainDialog
                onAddDomains={onSubmitAddDomainDialog}
                onOpenChange={onOpenChangeAddDomainDialog}
              />
            )}
          </div>
        </div>
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
        </tbody>
      </table>
      {!domains.length && !showNewRow && (
        <TableNoDataPlaceholder title='No Top-Level Domains'>
          <span>There are no top-level domains.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}
