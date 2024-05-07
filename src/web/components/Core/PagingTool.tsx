import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import {
  getPageNumberOptions,
  getRowsPerPageOptions,
  getShowingRowsText,
  RowsPerPageValues,
} from './PagingToolHelper';
import { SelectDropdown, SelectOption } from './SelectDropdown';

import './PagingTool.scss';

type PagingProps = Readonly<{
  numberTotalRows: number;
  onChangeRows: (currentPageNumber: number, currentRowsPerPage: RowsPerPageValues) => void;
  initialRowsPerPage?: RowsPerPageValues;
  initialPageNumber?: number;
}>;

export function PagingTool({
  numberTotalRows,
  onChangeRows,
  initialRowsPerPage = 10,
  initialPageNumber = 1,
}: PagingProps) {
  const initialPageNumberOptions = getPageNumberOptions(numberTotalRows, initialRowsPerPage);
  const rowsPerPageOptions = getRowsPerPageOptions(numberTotalRows);
  const initialRowsPerPageOption = rowsPerPageOptions.find(
    (number) => number.id === initialRowsPerPage
  );

  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPageValues>(initialRowsPerPage);
  const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
  const [pageNumberOptions, setPageNumberOptions] =
    useState<SelectOption<number>[]>(initialPageNumberOptions);

  useEffect(() => {
    setPageNumberOptions(getPageNumberOptions(numberTotalRows, initialRowsPerPage));
    setPageNumber(initialPageNumber);
    setRowsPerPage(initialRowsPerPage);
  }, [numberTotalRows, initialRowsPerPage, initialPageNumber]);

  const onIncreasePageNumber = () => {
    if (pageNumber < Math.ceil(numberTotalRows / rowsPerPage)) {
      setPageNumber(pageNumber + 1);
      onChangeRows(pageNumber + 1, rowsPerPage);
    }
  };

  const onDecreasePageNumber = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      onChangeRows(pageNumber - 1, rowsPerPage);
    }
  };

  const onChangeRowsPerPage = (selected: SelectOption<RowsPerPageValues>) => {
    const newRowsPerPage = selected.id;
    setRowsPerPage(newRowsPerPage);
    onChangeRows(1, newRowsPerPage);
    setPageNumberOptions(getPageNumberOptions(numberTotalRows, newRowsPerPage));
    setPageNumber(1);
  };

  const onChangePageNumber = (selected: SelectOption<number>) => {
    const newPageNumber = Number(selected.id);
    setPageNumber(newPageNumber);
    onChangeRows(newPageNumber, rowsPerPage);
  };

  return (
    <div className='paging-container'>
      <SelectDropdown
        containerClass='rows-per-page-dropdown-container'
        className='rows-per-page-dropdown'
        initialValue={initialRowsPerPageOption}
        updatedValue={rowsPerPageOptions.find((number) => number.id === rowsPerPage)}
        title='Rows Per Page'
        options={rowsPerPageOptions}
        onSelectedChange={onChangeRowsPerPage}
      />
      <p className='separator'>|</p>
      <p className='showing-rows-text'>
        {getShowingRowsText(pageNumber, rowsPerPage, numberTotalRows)}
      </p>
      <div className='paging-button'>
        <button
          type='button'
          className='icon-button'
          title='Previous Page'
          onClick={onDecreasePageNumber}
          disabled={pageNumber === 1}
        >
          <FontAwesomeIcon icon='angle-left' />
        </button>
      </div>
      <SelectDropdown
        containerClass='page-numbers-dropdown-container'
        className='page-numbers-dropdown'
        initialValue={pageNumberOptions[0]}
        updatedValue={pageNumberOptions.find((number) => number.id === pageNumber)}
        options={pageNumberOptions}
        onSelectedChange={onChangePageNumber}
      />
      <div className='paging-button'>
        <button
          type='button'
          className='icon-button'
          title='Next Page'
          onClick={onIncreasePageNumber}
          disabled={pageNumber === Math.ceil(numberTotalRows / rowsPerPage)}
        >
          <FontAwesomeIcon icon='angle-right' />
        </button>
      </div>
    </div>
  );
}
