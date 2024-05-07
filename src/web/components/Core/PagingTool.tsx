import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { SelectDropdown, SelectOption } from './SelectDropdown';

import './PagingTool.scss';

const rowsPerPageValues = [10, 25, 50, 100, 250] as const;

export type RowsPerPageValues = (typeof rowsPerPageValues)[number];

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
  const initialPageNumberOptions = Array.from(
    { length: Math.ceil(numberTotalRows / initialRowsPerPage) },
    (_, index) => index + 1
  ).map((number) => ({
    name: number.toString(),
    id: number,
  }));

  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPageValues>(initialRowsPerPage);
  const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
  const [pageNumberOptions, setPageNumberOptions] =
    useState<SelectOption<number>[]>(initialPageNumberOptions);

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
    setPageNumber(initialPageNumber);
    setRowsPerPage(initialRowsPerPage);
  }, [numberTotalRows, initialRowsPerPage, initialPageNumber]);

  const rowsPerPageOptions =
    numberTotalRows > rowsPerPageValues[0]
      ? rowsPerPageValues
          .filter((value) => value <= numberTotalRows)
          .map((value) => ({
            name: value.toString(),
            id: value,
          }))
      : [{ name: rowsPerPageValues[0].toString(), id: rowsPerPageValues[0] }];

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

  const onChangeRowsPerPage = (selected: SelectOption<RowsPerPageValues>) => {
    const newRowsPerPage = selected.id;
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
    const firstRow = numberTotalRows > 0 ? (pageNumber - 1) * rowsPerPage + 1 : 0;
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
        updatedValue={rowsPerPageOptions.find((number) => number.id === rowsPerPage)}
        title='Rows Per Page'
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
