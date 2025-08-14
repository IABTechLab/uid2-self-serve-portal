import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import './TableSearchBar.scss';

interface TableSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function TableSearchBar({ value, onChange, placeholder = 'Search...' }: TableSearchBarProps) {
  return (
    <div className='table-search-bar-container'>
      <input
        type='text'
        className='table-search-bar-input'
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
      <FontAwesomeIcon icon='search' className='table-search-bar-icon' />
    </div>
  );
}

export default TableSearchBar;
