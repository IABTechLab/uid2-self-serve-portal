import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';

import { PagingTool } from '../Core/PagingTool';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import CstgAddDomainDialog from './CstgAddDomainDialog';
import CstgDeleteDomainDialog from './CstgDeleteDomainDialog';
import { CstgDomainItem } from './CstgDomainItem';

import './CstgDomainsTable.scss';

type CstgDomainsTableProps = Readonly<{
  domains: string[];
  onUpdateDomains: (domains: string[], action: string) => Promise<void>;
  onAddDomains: (newDomainsFormatted: string[], deleteExistingList: boolean) => Promise<void>;
}>;

export function CstgDomainsTable({
  domains,
  onUpdateDomains,
  onAddDomains,
}: CstgDomainsTableProps) {
  const [showAddDomainsDialog, setShowAddDomainsDialog] = useState<boolean>(false);
  const [showDeleteDomainsDialog, setShowDeleteDomainsDialog] = useState<boolean>(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [searchedDomains, setSearchedDomains] = useState<string[]>(domains);
  const [pagedDomains, setPagedDomains] = useState<string[]>(domains);
  const [filterText, setFilterText] = useState('');

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

  const handleSelectDomain = (domain: string) => {
    if (isDomainSelected(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleSearchDomain = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    setSearchedDomains(domains.filter((d) => d.includes(event.target.value)));
  };

  const handleEditDomain = (updatedDomainName: string, originalDomainName: string) => {
    // removes original domain name from list and adds new domain name
    onUpdateDomains(
      [
        ...domains.filter((domain) => ![originalDomainName].includes(domain)),
        ...[updatedDomainName],
      ],
      'updated'
    );
  };

  const onOpenChangeAddDomainDialog = () => {
    setShowAddDomainsDialog(!showAddDomainsDialog);
  };

  const onOpenChangeDeleteDomainDialog = () => {
    setShowDeleteDomainsDialog(!showDeleteDomainsDialog);
  };

  const handleBulkDeleteDomains = (deleteDomains: string[]) => {
    onUpdateDomains(
      domains.filter((domain) => !deleteDomains.includes(domain)),
      'deleted'
    );
    setShowDeleteDomainsDialog(false);
    // setSearchedDomains(domains);
  };

  const onSubmitAddDomainDialog = async (
    newDomainsFormatted: string[],
    deleteExistingList: boolean
  ) => {
    await onAddDomains(newDomainsFormatted, deleteExistingList);
    setShowAddDomainsDialog(false);
    setSearchedDomains(domains.sort());
    setSelectedDomains([]);
  };

  const onChangeDisplayedDomains = (displayedDomains: string[]) => {
    setPagedDomains(displayedDomains);
  };

  return (
    <div className='cstg-domains-management'>
      <div className='cstg-domains-table-header'>
        <div>
          <h2>Top-Level Domains</h2>
          {domains?.length > 0 && (
            <div className='table-actions'>
              <TriStateCheckbox onClick={handleCheckboxChange} status={checkboxStatus} />

              <button
                className='transparent-button table-action-button'
                type='button'
                onClick={onOpenChangeDeleteDomainDialog}
              >
                {' '}
                <FontAwesomeIcon
                  icon={['far', 'trash-can']}
                  className='cstg-domains-management-icon'
                />
                {`Delete Domain${selectedDomains?.length > 1 ? 's' : ''}`}
              </button>

              {showDeleteDomainsDialog && selectedDomains.length > 0 && (
                <CstgDeleteDomainDialog
                  onRemoveDomains={() => handleBulkDeleteDomains(selectedDomains)}
                  domains={selectedDomains}
                  onOpenChange={onOpenChangeDeleteDomainDialog}
                />
              )}
            </div>
          )}
        </div>
        <div className='sharing-permissions-search-bar-container'>
          <input
            type='text'
            className='sharing-permissions-search-bar'
            onChange={handleSearchDomain}
            placeholder='Search Domains'
            value={filterText}
          />
          <FontAwesomeIcon icon='search' className='sharing-permission-search-bar-icon' />
        </div>
        <div className='cstg-domains-table-header-right'>
          <div className='add-domain-button'>
            <button className='small-button' type='button' onClick={onOpenChangeAddDomainDialog}>
              Add Domains
            </button>
            {showAddDomainsDialog && (
              <CstgAddDomainDialog
                onAddDomains={onSubmitAddDomainDialog}
                onOpenChange={onOpenChangeAddDomainDialog}
                existingDomains={domains}
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
        <tbody className='cstg-domains-table-body'>
          {pagedDomains.sort().map((domain) => (
            <CstgDomainItem
              key={domain}
              domain={domain}
              existingDomains={domains}
              onClick={() => handleSelectDomain(domain)}
              onDelete={() => handleBulkDeleteDomains([domain])}
              onEditDomain={handleEditDomain}
              checked={isDomainSelected(domain)}
            />
          ))}
          {filterText && !searchedDomains.length && (
            <p className='no-search-results'>
              There are no top-level domains that match this search.
            </p>
          )}
        </tbody>
      </table>
      <div className='domain-names-paging-right'>
        <PagingTool
          totalRows={searchedDomains.length ? searchedDomains.sort() : domains.sort()}
          rowsPerPageTitle='Domains Per Page'
          initialRowsPerPage={10}
          onChangeRows={onChangeDisplayedDomains}
        />
      </div>

      {!domains.length && (
        <TableNoDataPlaceholder title='No Top-Level Domains'>
          <span>There are no top-level domains.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}
