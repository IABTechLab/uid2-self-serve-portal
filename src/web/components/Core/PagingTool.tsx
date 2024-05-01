import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { SelectDropdown, SelectOption } from './SelectDropdown';

const rowsPerPageOptions = [10, 25, 50, 100, 250];

type RowsPerPageOptions = 10 | 25 | 50 | 100 | 250;

type PagingProps<T> = Readonly<{
  totalRows: T[];
  rowsPerPageTitle?: string;
  initialRowsPerPage?: RowsPerPageOptions;
  onChangeRows: (displayedRows: T[]) => void;
}>;

export function PagingTool<T>({
  totalRows,
  rowsPerPageTitle = 'Rows Per Page',
  initialRowsPerPage,
  onChangeRows,
}: PagingProps<T>) {
  const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage ?? 10);
  const [pageNumber, setPageNumber] = useState<number>(0);

  console.log('in paging tool');
  console.log(totalRows);
  console.log(initialRowsPerPage);

  const rowsPerPageFiltered = rowsPerPageOptions
    .filter((number) => number <= totalRows.length)
    .map((number) => ({
      name: number.toString(),
      id: number,
    }));

  const initialRowsPerPageOption = rowsPerPageFiltered.filter(
    (number) => number.id === initialRowsPerPage
  )[0];

  const filterRows = (currentPageNumber: number, currentRowsPerPage: number) => {
    const initialRow = currentPageNumber * currentRowsPerPage;
    return totalRows.filter(
      (_, index) => index >= initialRow && index < initialRow + currentRowsPerPage
    );
  };

  useEffect(() => {
    console.log('in use effect paging tool');
    console.log(totalRows);
    onChangeRows(filterRows(0, initialRowsPerPage ?? 10));
  }, [totalRows]);

  const onIncreasePageNumber = () => {
    if (pageNumber < totalRows.length / rowsPerPage - 1) {
      setPageNumber(pageNumber + 1);
      onChangeRows(filterRows(pageNumber + 1, rowsPerPage));
    }
  };

  const onDecreasePageNumber = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
      onChangeRows(filterRows(pageNumber - 1, rowsPerPage));
    }
  };

  const toFirstPage = () => {
    setPageNumber(0);
    onChangeRows(filterRows(0, rowsPerPage));
  };

  const toLastPage = () => {
    const lastPageNumber = Math.ceil(totalRows.length / rowsPerPage) - 1;
    setPageNumber(lastPageNumber);
    onChangeRows(filterRows(lastPageNumber, rowsPerPage));
  };

  const onChangeRowsPerPage = async (selected: SelectOption<number>) => {
    const newRowsPerPage = Number(selected.id);
    setRowsPerPage(newRowsPerPage);
    onChangeRows(filterRows(pageNumber, newRowsPerPage));
  };

  return (
    <div className='domain-names-paging-right'>
      <SelectDropdown
        className='domain-select-rows-per-page'
        initialValue={initialRowsPerPageOption}
        title={rowsPerPageTitle}
        options={rowsPerPageFiltered}
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
  );
}
