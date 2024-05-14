import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';

import { PagingTool } from '../Core/PagingTool';
import { RowsPerPageValues } from '../Core/PagingToolHelper';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import CstgAddDomainDialog from './CstgAddDomainDialog';
import CstgDeleteDomainDialog from './CstgDeleteDomainDialog';
import { getPagedDomains, UpdateDomainNamesResponse } from './CstgDomainHelper';
import { CstgDomainItem } from './CstgDomainItem';

import './CstgDomainsTable.scss';

type CstgDomainsTableProps = Readonly<{
  domains: string[];
  onUpdateDomains: (
    domains: string[],
    action: string
  ) => Promise<UpdateDomainNamesResponse | undefined>;
  onAddDomains: (
    newDomainsFormatted: string[],
    deleteExistingList: boolean
  ) => Promise<UpdateDomainNamesResponse | undefined>;
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

  const [invalidDomains, setInvalidDomains] = useState<string[]>([]);

  const isSelectedAll = domains.length && domains.every((d) => selectedDomains.includes(d));

  useEffect(() => {
    if (searchedDomains.length === 0 && searchText === '') {
      setSearchedDomains(domains);
      setPagedDomains(getPagedDomains(domains, initialPageNumber, initialRowsPerPage));
    }
  }, [domains, initialPageNumber, initialRowsPerPage, searchedDomains, searchText]);

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

  const handleBulkDeleteDomains = async (deleteDomains: string[]) => {
    const newDomainsResponse = await onUpdateDomains(
      domains.filter((domain) => !deleteDomains.includes(domain)),
      'deleted'
    );
    const newDomains = newDomainsResponse?.domains;
    setShowDeleteDomainsDialog(false);
    setSelectedDomains([]);
    setSearchText('');
    if (newDomains) {
      setSearchedDomains(newDomains);
      if (deleteDomains.every((domain) => pagedDomains.includes(domain))) {
        setPagedDomains(getPagedDomains(newDomains, pageNumber, rowsPerPage));
      } else {
        setPageNumber(initialPageNumber);
        setRowsPerPage(initialRowsPerPage);
        setPagedDomains(getPagedDomains(newDomains, initialPageNumber, initialRowsPerPage));
      }
    }
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
    const newSearchDomains = domains.filter((d) => d.includes(event.target.value));
    setSearchedDomains(newSearchDomains);
    setPageNumber(initialPageNumber);
    setRowsPerPage(initialRowsPerPage);
    setPagedDomains(getPagedDomains(newSearchDomains, initialPageNumber, initialRowsPerPage));
  };

  const handleEditDomain = async (updatedDomainName: string, originalDomainName: string) => {
    // removes original domain name from list and adds new domain name
    const editedDomainsResponse = await onUpdateDomains(
      [
        ...domains.filter((domain) => ![originalDomainName].includes(domain)),
        ...[updatedDomainName],
      ],
      'edited'
    );
    const editedDomains = editedDomainsResponse?.domains;
    const isValidDomains = editedDomainsResponse?.isValidDomains;
    if (editedDomains)
      if (isValidDomains) {
        setPagedDomains(getPagedDomains(editedDomains, pageNumber, rowsPerPage));
        setInvalidDomains([]);
      } else {
        setInvalidDomains(editedDomains);
      }
  };

  const onOpenChangeAddDomainDialog = () => {
    setShowAddDomainsDialog(!showAddDomainsDialog);
    setInvalidDomains([]);
  };

  const onOpenChangeDeleteDomainDialog = () => {
    setShowDeleteDomainsDialog(!showDeleteDomainsDialog);
  };

  const onSubmitAddDomainDialog = async (
    newDomainsFormatted: string[],
    deleteExistingList: boolean
  ) => {
    const newDomainsResponse = await onAddDomains(newDomainsFormatted, deleteExistingList);
    const newDomains = newDomainsResponse?.domains;
    const isValidDomains = newDomainsResponse?.isValidDomains;
    if (isValidDomains) {
      setShowAddDomainsDialog(false);
      setSearchedDomains(domains);
      setSelectedDomains([]);
      setSearchText('');
      setInvalidDomains([]);
      if (newDomains) {
        setPageNumber(initialPageNumber);
        setRowsPerPage(initialRowsPerPage);
        setPagedDomains(getPagedDomains(newDomains, initialPageNumber, initialRowsPerPage));
        setSearchedDomains(newDomains);
      }
    } else if (newDomains) {
      setInvalidDomains(newDomains);
    }
  };

  const onChangeDisplayedDomains = (
    currentPageNumber: number,
    currentRowsPerPage: RowsPerPageValues
  ) => {
    setPageNumber(currentPageNumber);
    setRowsPerPage(currentRowsPerPage);
    setPagedDomains(getPagedDomains(searchedDomains, currentPageNumber, currentRowsPerPage));
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
                invalidDomains={invalidDomains}
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
              isEditedValid={invalidDomains.length === 0}
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
