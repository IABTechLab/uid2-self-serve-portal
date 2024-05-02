import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { SelectDropdown, SelectOption } from './SelectDropdown';

import './PagingTool.scss';

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
  initialRowsPerPage = 10,
  onChangeRows,
}: PagingProps<T>) {
  const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(
    Math.ceil(totalRows.length / rowsPerPage)
  );
  const [pageNumberOptions, setPageNumberOptions] = useState<SelectOption<number>[]>(
    Array.from(
      { length: Math.ceil(totalRows.length / initialRowsPerPage) },
      (_, index) => index + 1
    ).map((number) => ({
      name: number.toString(),
      id: number,
    }))
  );

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
    // console.log('in use effect page number options');
    // console.log('tr:', totalRows);
    // console.log('init', initialRowsPerPage);
    // console.log(
    //   Array.from(
    //     { length: Math.ceil(totalRows.length / initialRowsPerPage) },
    //     (_, index) => index + 1
    //   ).map((number) => ({
    //     name: number.toString(),
    //     id: number,
    //   }))
    // );
  }, [totalRows]);

  // console.log(maxPageNumber);
  // console.log(pageNumber);
  console.log('page number options:', pageNumberOptions);

  // console.log('in paging tool');
  // console.log(totalRows);
  // console.log(initialRowsPerPage);

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
    onChangeRows(filterRows(0, initialRowsPerPage));
  }, [totalRows]);

  const onIncreasePageNumber = () => {
    if (pageNumber < totalRows.length / rowsPerPage - 1) {
      setPageNumber(pageNumber + 1);
      onChangeRows(filterRows(pageNumber + 1, rowsPerPage));
      // onChangePageNumber((pageNumber+1).map())
    }
  };

  const onDecreasePageNumber = () => {
    if (pageNumber > 0) {
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
    // console.log('inPageNumber options');
    // console.log('new page number options', newPageNumberOptions);
  };

  const onChangeRowsPerPage = (selected: SelectOption<number>) => {
    const newRowsPerPage = Number(selected.id);
    setRowsPerPage(newRowsPerPage);
    onChangeRows(filterRows(pageNumber, newRowsPerPage));
    setMaxPageNumber(Math.ceil(totalRows.length / newRowsPerPage));
    onChangePageNumberOptions(Math.ceil(totalRows.length / newRowsPerPage));
  };

  const onChangePageNumber = (selected: SelectOption<number>) => {
    console.log('in on change page num', selected);
    const newPageNumber = Number(selected.id);
    setPageNumber(newPageNumber);
    onChangeRows(filterRows(newPageNumber, rowsPerPage));
  };

  return (
    <div className='domain-names-paging-right'>
      <SelectDropdown
        containerClass='rows-per-page-dropdown-container'
        className='rows-per-page-dropdown'
        initialValue={initialRowsPerPageOption}
        title={rowsPerPageTitle}
        options={rowsPerPageFiltered}
        onSelectedChange={onChangeRowsPerPage}
      />
      <p className='separator'>|</p>
      <p className='showing-rows-text'>
        {' '}
        Showing {pageNumber * rowsPerPage + 1}-
        {pageNumber * rowsPerPage + rowsPerPage <= totalRows.length
          ? pageNumber * rowsPerPage + rowsPerPage
          : totalRows.length}{' '}
        of {totalRows.length}
      </p>
      <div className='button-item'>
        <button
          type='button'
          className='icon-button'
          title='Previous Page'
          onClick={onDecreasePageNumber}
        >
          <FontAwesomeIcon icon='angle-left' />
        </button>
      </div>
      <SelectDropdown
        containerClass='page-numbers-dropdown-container'
        className='page-numbers-dropdown'
        initialValue={pageNumberOptions[0]}
        updatedValue={pageNumberOptions.filter((number) => number.id === pageNumber + 1)[0]}
        title=''
        options={pageNumberOptions}
        onSelectedChange={onChangePageNumber}
      />
      <div className='button-item'>
        <button
          type='button'
          className='icon-button'
          title='Next Page'
          onClick={onIncreasePageNumber}
        >
          <FontAwesomeIcon icon='angle-right' />
        </button>
      </div>
    </div>
  );
}
