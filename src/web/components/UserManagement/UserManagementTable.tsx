import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { UserDTO } from '../../../api/entities/User';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { PagingTool } from '../Core/Paging/PagingTool';
import { RowsPerPageValues } from '../Core/Paging/PagingToolHelper';
import { SortableTableHeader } from '../Core/Tables/SortableTableHeader';
import { TableNoDataPlaceholder } from '../Core/Tables/TableNoDataPlaceholder';
import { UserManagementItem } from './UserManagementItem';

import './UserManagementTable.scss';

type UserManagementTableProps = Readonly<{
  users: UserDTO[];
  onChangeUserLock: (userId: number, isLocked: boolean) => Promise<void>;
  resetPassword: (userEmail: string) => Promise<void>;
}>;

function NoUsers() {
  return (
    <TableNoDataPlaceholder icon={<img src='/group-icon.svg' alt='group-icon' />} title='No Users'>
      <span>There are no users.</span>
    </TableNoDataPlaceholder>
  );
}

function UserManagementTableContent({
  users,
  onChangeUserLock,
  resetPassword,
}: UserManagementTableProps) {
  const initialRowsPerPage = 25;
  const initialPageNumber = 1;

  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPageValues>(initialRowsPerPage);
  const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
  const [searchText, setSearchText] = useState('');

  const getPagedUsers = (values: UserDTO[]) => {
    const pagedRows = values.filter((_, index) => {
      return (
        index >= (pageNumber - 1) * rowsPerPage &&
        index < (pageNumber - 1) * rowsPerPage + rowsPerPage
      );
    });
    return pagedRows;
  };

  const onChangeDisplayedUsers = (
    currentPageNumber: number,
    currentRowsPerPage: RowsPerPageValues
  ) => {
    setPageNumber(currentPageNumber);
    setRowsPerPage(currentRowsPerPage);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setPageNumber(initialPageNumber);
    setRowsPerPage(initialRowsPerPage);
  };

  let searchedUsers = users;
  if (searchText.length > 1) {
    searchedUsers = users.filter((item) => {
      const search = searchText.toLowerCase();
      return (
        item.lastName.toLowerCase().indexOf(search) >= 0 ||
        item.firstName.toLowerCase().indexOf(search) >= 0 ||
        item.email.toLowerCase().indexOf(search) >= 0
      );
    });
  }

  const { sortData } = useSortable<UserDTO>();
  const sortedUsers = sortData(searchedUsers);

  const pagedRows = getPagedUsers(sortedUsers);

  return (
    <div className='users-table-container'>
      <div className='table-header'>
        <div className='table-header-right'>
          <div className='search-bar-container'>
            <input
              type='text'
              className='search-bar-input'
              onChange={handleSearch}
              placeholder='Search users'
              value={searchText}
            />
            <FontAwesomeIcon icon='search' className='search-bar-icon' />
          </div>
        </div>
      </div>
      <table className='users-table'>
        <thead>
          <tr>
            <SortableTableHeader<UserDTO> sortKey='email' header='Email' />
            <SortableTableHeader<UserDTO> sortKey='firstName' header='First Name' />
            <SortableTableHeader<UserDTO> sortKey='lastName' header='Last Name' />
            <SortableTableHeader<UserDTO> sortKey='jobFunction' header='Job Function' />
            <th>Accepted Terms</th>
            <th className='dialogs'>Additional User Info</th>
            <th className='password-reset'>Reset Password</th>
            <th className='action'>Locked</th>
          </tr>
        </thead>

        <tbody>
          {pagedRows.map((user) => (
            <UserManagementItem
              key={user.id}
              user={user}
              onChangeUserLock={onChangeUserLock}
              resetPassword={resetPassword}
            />
          ))}
        </tbody>
      </table>
      {users.length > 0 && searchText && searchedUsers.length === 0 && (
        <TableNoDataPlaceholder
          icon={<img src='/document.svg' alt='email-icon' />}
          title='No Users'
        >
          <span>There are no users that match this search.</span>
        </TableNoDataPlaceholder>
      )}
      {!users.length && <NoUsers />}
      {!!searchedUsers.length && (
        <PagingTool
          numberTotalRows={searchedUsers.length}
          initialRowsPerPage={rowsPerPage}
          initialPageNumber={pageNumber}
          onChangeRows={onChangeDisplayedUsers}
        />
      )}
    </div>
  );
}

export default function UserManagementTable(props: UserManagementTableProps) {
  return (
    <SortableProvider>
      <UserManagementTableContent {...props} />
    </SortableProvider>
  );
}
