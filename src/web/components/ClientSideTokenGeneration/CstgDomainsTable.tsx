import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';

import { PagingTool, RowsPerPageValues } from '../Core/PagingTool';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import CstgAddDomainDialog from './CstgAddDomainDialog';
import CstgDeleteDomainDialog from './CstgDeleteDomainDialog';
import { getPagedDomains } from './CstgDomainHelper';
import { CstgDomainItem } from './CstgDomainItem';

import './CstgDomainsTable.scss';

type DomainActions =
  | 'Edit'
  | 'DeleteOne'
  | 'DeleteMany'
  | 'AddAndReplace'
  | 'Add'
  | 'Search'
  | 'PagingChange'
  | 'Initial';

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
  const initialRowsPerPage = 10;
  const initialPageNumber = 1;

  const [showAddDomainsDialog, setShowAddDomainsDialog] = useState<boolean>(false);
  const [showDeleteDomainsDialog, setShowDeleteDomainsDialog] = useState<boolean>(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [searchedDomains, setSearchedDomains] = useState<string[]>(domains);
  const [pagedDomains, setPagedDomains] = useState<string[]>(domains);
  const [searchText, setSearchText] = useState('');

  const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPageValues>(initialRowsPerPage);

  const [domainAction, setDomainAction] = useState<DomainActions>('Initial');

  const isSelectedAll = domains.length && domains.every((d) => selectedDomains.includes(d));

  useEffect(() => {
    if (searchText === '') {
      setSearchedDomains(domains);
    }
    if (['Edit', 'DeleteOne', 'Add', 'PagingChange'].includes(domainAction)) {
      setPagedDomains(getPagedDomains(searchedDomains, pageNumber, rowsPerPage));
    } else if (['AddAndReplace', 'DeleteMany', 'Search', 'Initial'].includes(domainAction)) {
      setPageNumber(initialPageNumber);
      setRowsPerPage(initialRowsPerPage);
      setPagedDomains(getPagedDomains(searchedDomains, pageNumber, rowsPerPage));
    }
  }, [domains, pageNumber, rowsPerPage, searchText, searchedDomains, domainAction]);

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
    setShowDeleteDomainsDialog(false);
    setSelectedDomains([]);
    setSearchedDomains([]);
    setSearchText('');
    if (deleteDomains.length === 1) setDomainAction('DeleteOne');
    else setDomainAction('DeleteMany');
  };

  const handleSelectDomain = (domain: string) => {
    if (isDomainSelected(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleSearchDomain = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setSearchedDomains(domains.filter((d) => d.includes(event.target.value)));
    if (event.target.value !== '') {
      setDomainAction('Search');
    }
  };

  const handleEditDomain = (updatedDomainName: string, originalDomainName: string) => {
    // removes original domain name from list and adds new domain name
    onUpdateDomains(
      [
        ...domains.filter((domain) => ![originalDomainName].includes(domain)),
        ...[updatedDomainName],
      ],
      'edited'
    );
    setDomainAction('Edit');
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
    setSearchedDomains(domains);
    setSelectedDomains([]);
    setSearchText('');
    const currentDomainAction = deleteExistingList ? 'AddAndReplace' : 'Add';
    setDomainAction(currentDomainAction);
  };

  const onChangeDisplayedDomains = (
    currentPageNumber: number,
    currentRowsPerPage: RowsPerPageValues
  ) => {
    setPageNumber(currentPageNumber);
    setRowsPerPage(currentRowsPerPage);
    setDomainAction('PagingChange');
  };

  return (
    <div className='cstg-domains-management'>
      <div className='cstg-domains-table-header'>
        <div>
          <h2>Root-Level Domains</h2>
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
                  {`Delete ${selectedDomains.length === domains.length ? 'All' : ''} Domain${
                    selectedDomains?.length > 1 ? 's' : ''
                  }`}
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
        <div className='cstg-domains-table-header-right'>
          <div className='domains-search-bar-container'>
            <input
              type='text'
              className='domains-search-bar'
              onChange={handleSearchDomain}
              placeholder='Search Domains'
              value={searchText}
            />
            <FontAwesomeIcon icon='search' className='domains-search-bar-icon' />
          </div>
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
        <tbody>
          {pagedDomains.map((domain) => (
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
        </tbody>
      </table>
      {searchText && !searchedDomains.length && (
        <TableNoDataPlaceholder title='No Root-Level Domains'>
          <span>There are no root-level domains that match this search.</span>
        </TableNoDataPlaceholder>
      )}
      {!!searchedDomains.length && (
        <PagingTool
          numberTotalRows={searchedDomains.length}
          initialRowsPerPage={rowsPerPage}
          initialPageNumber={pageNumber}
          onChangeRows={onChangeDisplayedDomains}
        />
      )}

      {!domains.length && (
        <TableNoDataPlaceholder title='No Root-Level Domains'>
          <span>There are no root-level domains.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}
