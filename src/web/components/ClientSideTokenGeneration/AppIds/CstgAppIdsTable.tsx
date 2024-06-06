import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';

import { PagingTool } from '../../Core/PagingTool';
import { RowsPerPageValues } from '../../Core/PagingToolHelper';
import { TableNoDataPlaceholder } from '../../Core/TableNoDataPlaceholder';
import { TriStateCheckbox, TriStateCheckboxState } from '../../Core/TriStateCheckbox';
import { getPagedDomains } from '../CstgHelper';
import CstgAddAppIdDialog from './CstgAddAppIdDialog';
import { CstgAppIdItem } from './CstgAppIdItem';
import CstgDeleteAppIdDialog from './CstgDeleteAppIdDialog';

import './CstgAppIdsTable.scss';

type AppIdsTableProps = Readonly<{
  appIds: string[];
  onUpdateAppIds: (appIds: string[], action: string) => Promise<string[] | undefined>;
  onAddAppIds: (
    newAppIdsFormatted: string[],
    deleteExistingList: boolean
  ) => Promise<string[] | undefined>;
}>;

export function CstgAppIdsTable({ appIds, onUpdateAppIds, onAddAppIds }: AppIdsTableProps) {
  const initialRowsPerPage = 10;
  const initialPageNumber = 1;

  const [showAddAppIdsDialog, setShowAddAppIdsDialog] = useState<boolean>(false);
  const [showDeleteAppIdsDialog, setShowDeleteAppIdsDialog] = useState<boolean>(false);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [searchedAppIds, setSearchedAppIds] = useState<string[]>(appIds);
  const [pagedAppIds, setPagedAppIds] = useState<string[]>(appIds);
  const [searchText, setSearchText] = useState('');

  const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPageValues>(initialRowsPerPage);

  const isSelectedAll = appIds.length && appIds.every((d) => selectedAppIds.includes(d));

  useEffect(() => {
    if (searchedAppIds.length === 0 && searchText === '') {
      setSearchedAppIds(appIds);
      setPagedAppIds(getPagedDomains(appIds, initialPageNumber, initialRowsPerPage));
    }
  }, [appIds, initialPageNumber, initialRowsPerPage, searchedAppIds, searchText]);

  const getCheckboxStatus = () => {
    if (isSelectedAll) {
      return TriStateCheckboxState.checked;
    }
    if (selectedAppIds.length > 0) {
      return TriStateCheckboxState.indeterminate as CheckedState;
    }
    return TriStateCheckboxState.unchecked;
  };

  const checkboxStatus = getCheckboxStatus();

  const handleCheckboxChange = () => {
    if (checkboxStatus === TriStateCheckboxState.unchecked) {
      setSelectedAppIds(appIds);
    } else {
      setSelectedAppIds([]);
    }
  };
  const isAppIdSelected = (appId: string) => selectedAppIds.includes(appId);

  const handleBulkDeleteAppIds = async (deleteAppIds: string[]) => {
    const newAppIdsResponse = await onUpdateAppIds(
      appIds.filter((appId) => !deleteAppIds.includes(appId)),
      'deleted'
    );
    const newAppIds = newAppIdsResponse;
    setShowDeleteAppIdsDialog(false);
    setSelectedAppIds([]);
    setSearchText('');
    if (newAppIds) {
      setSearchedAppIds(newAppIds);
      if (deleteAppIds.every((appId) => pagedAppIds.includes(appId))) {
        setPagedAppIds(getPagedDomains(newAppIds, pageNumber, rowsPerPage));
      } else {
        setPageNumber(initialPageNumber);
        setRowsPerPage(initialRowsPerPage);
        setPagedAppIds(getPagedDomains(newAppIds, initialPageNumber, initialRowsPerPage));
      }
    }
  };

  const handleSelectAppId = (appId: string) => {
    if (isAppIdSelected(appId)) {
      setSelectedAppIds(selectedAppIds.filter((d) => d !== appId));
    } else {
      setSelectedAppIds([...selectedAppIds, appId]);
    }
  };

  const handleSearchAppId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    const newSearchAppIds = appIds.filter((d) => d.includes(event.target.value));
    setSearchedAppIds(newSearchAppIds);
    setPageNumber(initialPageNumber);
    setRowsPerPage(initialRowsPerPage);
    setPagedAppIds(getPagedDomains(newSearchAppIds, initialPageNumber, initialRowsPerPage));
  };

  const handleEditAppId = async (
    updatedAppIdName: string,
    originalAppIdName: string
  ): Promise<boolean> => {
    // removes original appId name from list and adds new appId name
    const editedAppIdsResponse = await onUpdateAppIds(
      [...appIds.filter((appId) => ![originalAppIdName].includes(appId)), ...[updatedAppIdName]],
      'edited'
    );
    const editedAppIds = editedAppIdsResponse;
    if (editedAppIds) {
      setPagedAppIds(getPagedDomains(editedAppIds, pageNumber, rowsPerPage));
      return true;
    }
    return false;
  };

  const onOpenChangeAddAppIdDialog = () => {
    setShowAddAppIdsDialog(!showAddAppIdsDialog);
  };

  const onOpenChangeDeleteAppIdDialog = () => {
    setShowDeleteAppIdsDialog(!showDeleteAppIdsDialog);
  };

  const onSubmitAddAppIdDialog = async (
    newAppIdsFormatted: string[],
    deleteExistingList: boolean
  ): Promise<string[]> => {
    const newAppIdsResponse = await onAddAppIds(newAppIdsFormatted, deleteExistingList);
    const newAppIds = newAppIdsResponse;
    if (newAppIds) {
      setShowAddAppIdsDialog(false);
      setSearchedAppIds(appIds);
      setSelectedAppIds([]);
      setSearchText('');
      setPageNumber(initialPageNumber);
      setRowsPerPage(initialRowsPerPage);
      setPagedAppIds(getPagedDomains(newAppIds, initialPageNumber, initialRowsPerPage));
      setSearchedAppIds(newAppIds);
    }

    if (newAppIds) {
      return newAppIds;
    }
    return [];
  };

  const onChangeDisplayedAppIds = (
    currentPageNumber: number,
    currentRowsPerPage: RowsPerPageValues
  ) => {
    setPageNumber(currentPageNumber);
    setRowsPerPage(currentRowsPerPage);
    setPagedAppIds(getPagedDomains(searchedAppIds, currentPageNumber, currentRowsPerPage));
  };

  return (
    <div className='cstg-app-names-management'>
      <div className='cstg-app-names-table-header'>
        <div>
          <h2>Mobile App Ids</h2>
          {appIds?.length > 0 && (
            <div className='table-actions'>
              <TriStateCheckbox onClick={handleCheckboxChange} status={checkboxStatus} />
              {checkboxStatus && (
                <button
                  className='transparent-button table-action-button'
                  type='button'
                  onClick={onOpenChangeDeleteAppIdDialog}
                >
                  {' '}
                  <FontAwesomeIcon
                    icon={['far', 'trash-can']}
                    className='cstg-app-names-management-icon'
                  />
                  {`Delete ${selectedAppIds.length === appIds.length ? 'All' : ''} Mobile App Id${
                    selectedAppIds?.length > 1 ? 's' : ''
                  }`}
                </button>
              )}

              {showDeleteAppIdsDialog && selectedAppIds.length > 0 && (
                <CstgDeleteAppIdDialog
                  onRemoveAppIds={() => handleBulkDeleteAppIds(selectedAppIds)}
                  appIds={selectedAppIds}
                  onOpenChange={onOpenChangeDeleteAppIdDialog}
                />
              )}
            </div>
          )}
        </div>
        <div className='cstg-app-names-table-header-right'>
          <div className='app-names-search-bar-container'>
            <input
              type='text'
              className='app-names-search-bar'
              onChange={handleSearchAppId}
              placeholder='Search Mobile App Ids'
              value={searchText}
            />
            <FontAwesomeIcon icon='search' className='app-names-search-bar-icon' />
          </div>
          <div className='add-appId-button'>
            <button className='small-button' type='button' onClick={onOpenChangeAddAppIdDialog}>
              Add Mobile App Ids
            </button>
            {showAddAppIdsDialog && (
              <CstgAddAppIdDialog
                onAddAppIds={onSubmitAddAppIdDialog}
                onOpenChange={onOpenChangeAddAppIdDialog}
                existingAppIds={appIds}
              />
            )}
          </div>
        </div>
      </div>
      <table className='cstg-app-names-table'>
        <thead>
          <tr>
            <th> </th>
            <th className='appId'>Mobile App ID</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagedAppIds.map((appId) => (
            <CstgAppIdItem
              key={appId}
              appId={appId}
              existingAppIds={appIds}
              onClick={() => handleSelectAppId(appId)}
              onDelete={() => handleBulkDeleteAppIds([appId])}
              onEditAppId={handleEditAppId}
              checked={isAppIdSelected(appId)}
            />
          ))}
        </tbody>
      </table>
      {searchText && !searchedAppIds.length && (
        <TableNoDataPlaceholder title='No Mobile App Ids'>
          <span>There are no mobile app ids that match this search.</span>
        </TableNoDataPlaceholder>
      )}
      {!!searchedAppIds.length && (
        <PagingTool
          numberTotalRows={searchedAppIds.length}
          initialRowsPerPage={rowsPerPage}
          initialPageNumber={pageNumber}
          onChangeRows={onChangeDisplayedAppIds}
        />
      )}

      {!appIds.length && (
        <TableNoDataPlaceholder title='No Mobile App Ids'>
          <span>There are no mobile app ids.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}
