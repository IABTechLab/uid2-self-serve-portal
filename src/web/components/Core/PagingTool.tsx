import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';

import { SelectDropdown, SelectOption } from './SelectDropdown';

const rowsPerPageOptions = [10, 25, 50, 100, 250];

type RowsPerPageOptions = 10 | 25;

type PagingProps = Readonly<{
  rows: ReactNode[];
  rowsPerPageTitle?: string;
  initialRowsPerPage?: RowsPerPageOptions;
}>;

export function Paging({
  rows,
  rowsPerPageTitle = 'Rows Per Page',
  initialRowsPerPage,
}: PagingProps) {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const rowsPerPageFiltered = rowsPerPageOptions
    .filter((number) => number <= rows.length)
    .map((number) => ({
      name: number.toString(),
      id: number,
    }));

  const onIncreasePageNumber = () => {
    if (pageNumber < rows.length / rowsPerPage - 1) {
      setPageNumber(pageNumber + 1);
    }
  };

  const onDecreasePageNumber = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  const toFirstPage = () => {
    setPageNumber(0);
  };

  const toLastPage = () => {
    setPageNumber(Math.ceil(rows.length / rowsPerPage) - 1);
  };

  const onChangeRowsPerPage = (selected: SelectOption<number>) => {
    setRowsPerPage(Number(selected.id));
  };

  return (
    <div className='domain-names-paging-right'>
      <SelectDropdown
        className='domain-select-rows-per-page'
        initialValue={initialRowsPerPage}
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
