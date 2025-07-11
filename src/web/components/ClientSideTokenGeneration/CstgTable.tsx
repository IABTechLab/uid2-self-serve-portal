import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';

import { PagingTool } from '../Core/Paging/PagingTool';
import { RowsPerPageValues } from '../Core/Paging/PagingToolHelper';
import { TableNoDataPlaceholder } from '../Core/Tables/TableNoDataPlaceholder';
import { TriStateCheckbox, TriStateCheckboxState } from '../Input/TriStateCheckbox';
import CstgAddDialog from './CstgAddDialog';
import CstgDeleteDialog from './CstgDeleteDialog';
import {
  CstgValueType,
  formatCstgValueType,
  getPagedValues,
  UpdateCstgValuesResponse,
} from './CstgHelper';
import { CstgItem } from './CstgItem';

import './CstgTable.scss';

type CstgTableProps = Readonly<{
  cstgValues: string[];
  onUpdateCstgValues: (cstgValues: string[]) => Promise<UpdateCstgValuesResponse | undefined>;
  onAddCstgValues: (
    newCstgValuesFormatted: string[],
    deleteExistingList: boolean,
    cstgType: CstgValueType,
    existingCstgValues: string[]
  ) => Promise<UpdateCstgValuesResponse | undefined>;
  cstgValueType: CstgValueType;
  addInstructions: string;
}>;

export function CstgTable({
  cstgValues,
  onUpdateCstgValues,
  onAddCstgValues,
  cstgValueType,
  addInstructions,
}: CstgTableProps) {
  const initialRowsPerPage = 10;
  const initialPageNumber = 1;

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [selectedCstgValues, setSelectedCstgValues] = useState<string[]>([]);
  const [searchedCstgValues, setSearchedCstgValues] = useState<string[]>(cstgValues);
  const [pagedCstgValues, setPagedCstgValues] = useState<string[]>(cstgValues);
  const [searchText, setSearchText] = useState('');

  const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPageValues>(initialRowsPerPage);

  const isSelectedAll = selectedCstgValues.length === cstgValues.length;

  useEffect(() => {
    if (searchText === '') {
      setPagedCstgValues(getPagedValues(cstgValues, initialPageNumber, initialRowsPerPage));
    }
  }, [cstgValues, initialPageNumber, initialRowsPerPage, searchedCstgValues, searchText]);

  const getCheckboxStatus = () => {
    if (isSelectedAll) {
      return TriStateCheckboxState.checked;
    }
    if (selectedCstgValues.length > 0) {
      return TriStateCheckboxState.indeterminate as CheckedState;
    }
    return TriStateCheckboxState.unchecked;
  };

  const checkboxStatus = getCheckboxStatus();

  const handleCheckboxChange = () => {
    if (checkboxStatus === TriStateCheckboxState.unchecked) {
      setSelectedCstgValues(cstgValues);
    } else {
      setSelectedCstgValues([]);
    }
  };
  const isCstgValueSelected = (cstgValue: string) => selectedCstgValues.includes(cstgValue);

  const handleBulkDeleteCstgValues = async (deleteCstgValues: string[]) => {
    const newCstgValuesResponse = await onUpdateCstgValues(
      cstgValues.filter((cstgValue) => !deleteCstgValues.includes(cstgValue))
    );
    const newCstgValues = newCstgValuesResponse?.cstgValues;
    setShowDeleteDialog(false);
    setSelectedCstgValues([]);
    setSearchText('');
    if (newCstgValues) {
      setSearchedCstgValues(newCstgValues);
      if (deleteCstgValues.every((cstgValue) => pagedCstgValues.includes(cstgValue))) {
        setPagedCstgValues(getPagedValues(newCstgValues, pageNumber, rowsPerPage));
      } else {
        setPageNumber(initialPageNumber);
        setRowsPerPage(initialRowsPerPage);
        setPagedCstgValues(getPagedValues(newCstgValues, initialPageNumber, initialRowsPerPage));
      }
    }
  };

  const handleSelectCstgValue = (cstgValue: string) => {
    if (isCstgValueSelected(cstgValue)) {
      setSelectedCstgValues(selectedCstgValues.filter((d) => d !== cstgValue));
    } else {
      setSelectedCstgValues([...selectedCstgValues, cstgValue]);
    }
  };

  const handleSearchCstgValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    const newSearchDomains = cstgValues.filter((d) => d.includes(event.target.value));
    setSearchedCstgValues(newSearchDomains);
    setPageNumber(initialPageNumber);
    setRowsPerPage(initialRowsPerPage);
    setPagedCstgValues(getPagedValues(newSearchDomains, initialPageNumber, initialRowsPerPage));
  };

  const handleEditCstgValue = async (
    updatedCstgValue: string,
    originalCstgValue: string
  ): Promise<boolean> => {
    // removes original domain name from list and adds new domain name
    const editedCstgValueResponse = await onUpdateCstgValues([
      ...cstgValues.filter((cstgValue) => ![originalCstgValue].includes(cstgValue)),
      ...[updatedCstgValue],
    ]);
    const editedCstgValues = editedCstgValueResponse?.cstgValues;
    const isValid = editedCstgValueResponse?.isValidCstgValues;
    if (editedCstgValues && isValid) {
      setPagedCstgValues(getPagedValues(editedCstgValues, pageNumber, rowsPerPage));
      return true;
    }
    return false;
  };

  const onOpenChangeAddDialog = () => {
    setShowAddDialog(!showAddDialog);
  };

  const onOpenChangeDeleteDialog = () => {
    setShowDeleteDialog(!showDeleteDialog);
  };

  const onSubmitAddDialog = async (
    newCstgValuesFormatted: string[],
    deleteExistingList: boolean
  ): Promise<string[]> => {
    const newCstgValuesResponse = await onAddCstgValues(
      newCstgValuesFormatted,
      deleteExistingList,
      cstgValueType,
      cstgValues
    );
    const newCstgValues = newCstgValuesResponse?.cstgValues;
    const isValid = newCstgValuesResponse?.isValidCstgValues;
    if (isValid) {
      setShowAddDialog(false);
      setSearchedCstgValues(cstgValues);
      setSelectedCstgValues([]);
      setSearchText('');
      if (newCstgValues) {
        setPageNumber(initialPageNumber);
        setRowsPerPage(initialRowsPerPage);
        setPagedCstgValues(getPagedValues(newCstgValues, initialPageNumber, initialRowsPerPage));
        setSearchedCstgValues(newCstgValues);
      }
      return [];
    }
    if (newCstgValues) {
      return newCstgValues;
    }
    return [];
  };

  const onChangeDisplayedCstgValues = (
    currentPageNumber: number,
    currentRowsPerPage: RowsPerPageValues
  ) => {
    setPageNumber(currentPageNumber);
    setRowsPerPage(currentRowsPerPage);
    setPagedCstgValues(getPagedValues(searchedCstgValues, currentPageNumber, currentRowsPerPage));
  };

  const deletingMultipleItemsMessage = `Delete ${cstgValueType}${selectedCstgValues.length > 1 ? 's' : ''}`;
  const deleteMessage = isSelectedAll
    ? `Delete All ${cstgValueType}s`
    : deletingMultipleItemsMessage;

  const formattedCstgValueType = formatCstgValueType(cstgValueType);

  return (
    <div className='cstg-values-management'>
      <div className='cstg-values-table-header'>
        <div>
          <h2>{cstgValueType}s</h2>
          {cstgValues.length > 0 && (
            <div className='table-actions'>
              <TriStateCheckbox onClick={handleCheckboxChange} status={checkboxStatus} />
              {checkboxStatus && (
                <button
                  className='transparent-button table-action-button'
                  type='button'
                  onClick={onOpenChangeDeleteDialog}
                >
                  <FontAwesomeIcon
                    icon={['far', 'trash-can']}
                    className='cstg-values-management-icon'
                  />
                  {deleteMessage}
                </button>
              )}

              {showDeleteDialog && selectedCstgValues.length > 0 && (
                <CstgDeleteDialog
                  onRemoveCstgValues={() => handleBulkDeleteCstgValues(selectedCstgValues)}
                  cstgValues={selectedCstgValues}
                  onOpenChange={onOpenChangeDeleteDialog}
                  cstgValueType={cstgValueType}
                />
              )}
            </div>
          )}
        </div>
        <div className='table-header-right'>
          <div className='search-bar-container'>
            <input
              type='text'
              className='search-bar-input'
              onChange={handleSearchCstgValue}
              placeholder={`Search ${formattedCstgValueType}s`}
              value={searchText}
            />
            <FontAwesomeIcon icon='search' className='search-bar-icon' />
          </div>
          <div className='add-cstg-value-button'>
            <button className='small-button' type='button' onClick={onOpenChangeAddDialog}>
              {`Add ${cstgValueType}s`}
            </button>
            {showAddDialog && (
              <CstgAddDialog
                onAddCstgValues={onSubmitAddDialog}
                onOpenChange={onOpenChangeAddDialog}
                existingCstgValues={cstgValues}
                cstgValueType={cstgValueType}
                addInstructions={addInstructions}
              />
            )}
          </div>
        </div>
      </div>
      <table className='cstg-values-table'>
        <thead>
          <tr>
            <th> </th>
            <th className='cstg-value'>{cstgValueType}</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagedCstgValues.map((cstgValue) => (
            <CstgItem
              key={cstgValue}
              cstgValue={cstgValue}
              existingCstgValues={cstgValues}
              onClick={() => handleSelectCstgValue(cstgValue)}
              onDelete={() => handleBulkDeleteCstgValues([cstgValue])}
              onEdit={handleEditCstgValue}
              checked={isCstgValueSelected(cstgValue)}
              cstgValueType={cstgValueType}
            />
          ))}
        </tbody>
      </table>
      {cstgValues.length !== 0 && searchText && !searchedCstgValues.length && (
        <TableNoDataPlaceholder title={`No ${cstgValueType}s`}>
          <span>{`There are no ${formattedCstgValueType}s that match this search.`}</span>
        </TableNoDataPlaceholder>
      )}
      {!!searchedCstgValues.length && (
        <PagingTool
          numberTotalRows={searchedCstgValues.length}
          initialRowsPerPage={rowsPerPage}
          initialPageNumber={pageNumber}
          onChangeRows={onChangeDisplayedCstgValues}
        />
      )}

      {!cstgValues.length && (
        <TableNoDataPlaceholder title={`No ${cstgValueType}s`}>
          <span>{`There are no ${formattedCstgValueType}s.`}</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}
