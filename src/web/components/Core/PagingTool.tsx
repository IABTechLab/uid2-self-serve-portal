import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { SelectDropdown, SelectOption } from './SelectDropdown';

import './PagingTool.scss';

const rowsPerPageValues = [10, 25, 50, 100, 250];

type RowsPerPageValues = 10 | 25 | 50 | 100 | 250;

type PagingProps = Readonly<{
  numberTotalRows: number;
  onChangeRows: (currentPageNumber: number, currentRowsPerPage: number) => void;
  rowsPerPageTitle?: string;
  initialRowsPerPage?: RowsPerPageValues;
}>;

export function PagingTool<T>({
  numberTotalRows,
  onChangeRows,
  rowsPerPageTitle = 'Rows Per Page',
  initialRowsPerPage = 10,
}: PagingProps) {
  const initialPageOptions = Array.from(
    { length: Math.ceil(numberTotalRows / initialRowsPerPage) },
    (_, index) => index + 1
  ).map((number) => ({
    name: number.toString(),
    id: number,
  }));

  const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageNumberOptions, setPageNumberOptions] =
    useState<SelectOption<number>[]>(initialPageOptions);

  useEffect(() => {
    setPageNumberOptions(
      Array.from(
        { length: Math.ceil(numberTotalRows / initialRowsPerPage) },
        (_, index) => index + 1
      ).map((number) => ({
        name: number.toString(),
        id: number,
      }))
    );
    setPageNumber(1);
    setRowsPerPage(initialRowsPerPage);
  }, [numberTotalRows, initialRowsPerPage]);

  const rowsPerPageOptions =
    numberTotalRows > 10
      ? rowsPerPageValues
          .filter((number) => number <= numberTotalRows)
          .map((number) => ({
            name: number.toString(),
            id: number,
          }))
      : [{ name: '10', id: 10 }];

  const initialRowsPerPageOption = rowsPerPageOptions.find(
    (number) => number.id === initialRowsPerPage
  );

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

  const onChangePageNumberOptions = (maxPageNum: number) => {
    const newPageNumberOptions = Array.from({ length: maxPageNum }, (_, index) => index + 1).map(
      (number) => ({
        name: number.toString(),
        id: number,
      })
    );
    setPageNumberOptions(newPageNumberOptions);
  };

  const onChangeRowsPerPage = (selected: SelectOption<number>) => {
    const newRowsPerPage = Number(selected.id);
    setRowsPerPage(newRowsPerPage);
    onChangeRows(1, newRowsPerPage);
    onChangePageNumberOptions(Math.ceil(numberTotalRows / newRowsPerPage));
    setPageNumber(1);
  };

  const onChangePageNumber = (selected: SelectOption<number>) => {
    const newPageNumber = Number(selected.id);
    setPageNumber(newPageNumber);
    onChangeRows(newPageNumber, rowsPerPage);
  };

  const getShowingRowsText = () => {
    const firstRow = (pageNumber - 1) * rowsPerPage + 1;
    const lastRow = (pageNumber - 1) * rowsPerPage + rowsPerPage;
    return `Showing ${firstRow} -
        ${lastRow <= numberTotalRows ? lastRow : numberTotalRows}
        of ${numberTotalRows}`;
  };

  return (
    <div className='paging-container'>
      <SelectDropdown
        containerClass='rows-per-page-dropdown-container'
        className='rows-per-page-dropdown'
        initialValue={initialRowsPerPageOption}
        title={rowsPerPageTitle}
        options={rowsPerPageOptions}
        onSelectedChange={onChangeRowsPerPage}
      />
      <p className='separator'>|</p>
      <p className='showing-rows-text'>{getShowingRowsText()}</p>
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
        title=''
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
