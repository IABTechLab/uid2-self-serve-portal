import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import './SearchBarHeader.scss';

interface SearchBarHeaderProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function SearchBarHeader({ value, onChange, placeholder = 'Search...' }: SearchBarHeaderProps) {
  return (
    <div className='search-bar-header-container'>
      <input
        type='text'
        className='search-bar-header-input'
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
      <FontAwesomeIcon icon='search' className='search-bar-header-icon' />
    </div>
  );
}

export default SearchBarHeader;
