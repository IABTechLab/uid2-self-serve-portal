import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { SelectDropdown, SelectOption } from './SelectDropdown';

import './PagingTool.scss';

const rowsPerPageValues = [10, 25, 50, 100, 250];

type RowsPerPageValues = 10 | 25 | 50 | 100 | 250;

type PagingProps<T> = Readonly<{
  totalRows: T[];
  onChangeRows: (displayedRows: T[]) => void;
  rowsPerPageTitle?: string;
  initialRowsPerPage?: RowsPerPageValues;
}>;

export function PagingTool<T>({
  totalRows,
  onChangeRows,
  rowsPerPageTitle = 'Rows Per Page',
  initialRowsPerPage = 10,
}: PagingProps<T>) {
  const initialPagingOptions = Array.from(
    { length: Math.ceil(totalRows.length / initialRowsPerPage) },
    (_, index) => index + 1
  ).map((number) => ({
    name: number.toString(),
    id: number,
  }));

  console.log(totalRows);

  const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageNumberOptions, setPageNumberOptions] =
    useState<SelectOption<number>[]>(initialPagingOptions);

  useEffect(() => {
    setPageNumberOptions(
      Array.from(
        { length: Math.ceil(totalRows.length / initialRowsPerPage) },
        (_, index) => index + 1
      ).map((number) => ({
        name: number.toString(),
        id: number,
      }))
    );
  }, [totalRows, initialRowsPerPage]);

  const rowsPerPageOptions = rowsPerPageValues
    .filter((number) => number <= totalRows.length)
    .map((number) => ({
      name: number.toString(),
      id: number,
    }));

  const initialRowsPerPageOption = rowsPerPageOptions.find(
    (number) => number.id === initialRowsPerPage
  );

  const filterRows = (currentPageNumber: number, currentRowsPerPage: number) => {
    const initialRow = (currentPageNumber - 1) * currentRowsPerPage;
    return totalRows.filter(
      (_, index) => index >= initialRow && index < initialRow + currentRowsPerPage
    );
  };

  const onIncreasePageNumber = () => {
    if (pageNumber < Math.ceil(totalRows.length / rowsPerPage)) {
      setPageNumber(pageNumber + 1);
      onChangeRows(filterRows(pageNumber + 1, rowsPerPage));
    }
  };

  const onDecreasePageNumber = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      onChangeRows(filterRows(pageNumber - 1, rowsPerPage));
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
    onChangeRows(filterRows(pageNumber, newRowsPerPage));
    onChangePageNumberOptions(Math.ceil(totalRows.length / newRowsPerPage));
  };

  const onChangePageNumber = (selected: SelectOption<number>) => {
    const newPageNumber = Number(selected.id);
    setPageNumber(newPageNumber);
    onChangeRows(filterRows(newPageNumber, rowsPerPage));
  };

  const getShowingRowsText = () => {
    const firstRow = (pageNumber - 1) * rowsPerPage + 1;
    const lastRow = (pageNumber - 1) * rowsPerPage + rowsPerPage;
    return `Showing ${firstRow} -
        ${lastRow <= totalRows.length ? lastRow : totalRows.length}
        of ${totalRows.length}`;
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
          disabled={pageNumber === Math.ceil(totalRows.length / rowsPerPage)}
        >
          <FontAwesomeIcon icon='angle-right' />
        </button>
      </div>
    </div>
  );
}
