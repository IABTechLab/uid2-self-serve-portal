import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';

import { SelectDropdown, SelectOption } from '../Core/SelectDropdown';
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
  const [filteredDomains, setFilteredDomains] = useState<string[]>(domains);
  const [filterText, setFilterText] = useState('');
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(15);

  useEffect(() => {
    setPageNumber(0);
    setRowsPerPage(10);
    setFilteredDomains(domains);
  }, [domains]);

  const rowsPerPageOptions = [10, 25, 50, 100, 250, 500, 1000]
    .filter((number) => number <= domains.length)
    .map((number) => ({
      name: number.toString(),
      id: number,
    }));

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
    onUpdateDomains(
      domains.filter((domain) => !deleteDomains.includes(domain)),
      'deleted'
    );
    setFilteredDomains(domains);
  };

  const handleSelectDomain = (domain: string) => {
    if (isDomainSelected(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleSearchDomain = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    setFilteredDomains(domains.filter((d) => d.includes(event.target.value)));
    setPageNumber(0);
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

  const onSubmitAddDomainDialog = async (
    newDomainsFormatted: string[],
    deleteExistingList: boolean
  ) => {
    await onAddDomains(newDomainsFormatted, deleteExistingList);
    setShowAddDomainsDialog(false);
    setFilteredDomains(domains);
    setSelectedDomains([]);
  };

  const onIncreasePageNumber = () => {
    if (pageNumber < filteredDomains.length / rowsPerPage - 1) {
      setPageNumber(pageNumber + 1);
    }
  };

  const onDecreasePageNumber = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  const toFirstPage = () => {
    setPageNumber(0);
  };

  const toLastPage = () => {
    setPageNumber(Math.ceil(filteredDomains.length / rowsPerPage) - 1);
  };

  const onChangeRowsPerPage = (selected: SelectOption<number>) => {
    setRowsPerPage(Number(selected.id));
  };

  return (
    <div className='cstg-domains-management'>
      <div className='cstg-domains-table-header'>
        <div>
          <h2>Top-Level Domains</h2>
          {domains?.length > 0 && (
            <div className='table-actions'>
              <TriStateCheckbox onClick={handleCheckboxChange} status={checkboxStatus} />
              {checkboxStatus && (
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
              )}

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
          {filteredDomains
            .sort()
            .slice(pageNumber * rowsPerPage, pageNumber * rowsPerPage + rowsPerPage)
            .map((domain) => (
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
          {!filteredDomains.length && (
            <p className='no-search-results'>
              There are no top-level domains that match this search.
            </p>
          )}
        </tbody>
      </table>
      <div className='domain-names-paging-right'>
        <SelectDropdown
          className='domain-select-rows-per-page'
          title='Rows Per Page'
          options={rowsPerPageOptions}
          onSelectedChange={onChangeRowsPerPage}
        />

        <div className='button-item'>
          <button type='button' className='icon-button' title='First Page' onClick={toFirstPage}>
            <FontAwesomeIcon icon='circle-arrow-left' />
          </button>
          <p>First</p>
        </div>
        <div className='button-item'>
          <button
            type='button'
            className='icon-button'
            title='Previous Page'
            onClick={onDecreasePageNumber}
          >
            <FontAwesomeIcon icon='arrow-left' />
          </button>
          <p>Previous</p>
        </div>
        <div className='button-item'>
          <button
            type='button'
            className='icon-button'
            title='Next Page'
            onClick={onIncreasePageNumber}
          >
            <FontAwesomeIcon icon='arrow-right' />
          </button>
          <p>Next</p>
        </div>
        <div className='button-item'>
          <button type='button' className='icon-button' title='Last Page' onClick={toLastPage}>
            <FontAwesomeIcon icon='circle-arrow-right' />
          </button>
          <p>Last</p>
        </div>
      </div>

      {!domains.length && (
        <TableNoDataPlaceholder title='No Top-Level Domains'>
          <span>There are no top-level domains.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}
