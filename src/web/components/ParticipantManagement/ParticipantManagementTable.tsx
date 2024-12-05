import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { UpdateParticipantForm } from '../../services/participant';
import { PagingTool } from '../Core/Paging/PagingTool';
import { RowsPerPageValues } from '../Core/Paging/PagingToolHelper';
import { SortableTableHeader } from '../Core/Tables/SortableTableHeader';
import { TableNoDataPlaceholder } from '../Core/Tables/TableNoDataPlaceholder';
import { ParticipantManagmentItem } from './ParticipantManagementItem';

import './ParticipantManagementTable.scss';

type ParticipantManagementTableProps = Readonly<{
  participants: ParticipantDTO[];
  apiRoles: ApiRoleDTO[];
  participantTypes: ParticipantTypeDTO[];
  onUpdateParticipant: (form: UpdateParticipantForm, participant: ParticipantDTO) => Promise<void>;
}>;

function NoParticipants() {
  return (
    <TableNoDataPlaceholder
      icon={<img src='/group-icon.svg' alt='group-icon' />}
      title='No Participants'
    >
      <span>There are no participants.</span>
    </TableNoDataPlaceholder>
  );
}

function ParticipantManagementTableContent({
  participants,
  apiRoles,
  participantTypes,
  onUpdateParticipant,
}: ParticipantManagementTableProps) {
  const initialRowsPerPage = 10;
  const initialPageNumber = 1;

  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPageValues>(initialRowsPerPage);
  const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
  const [searchText, setSearchText] = useState('');

  const getPagedParticipants = (values: ParticipantDTO[]) => {
    const pagedRows = values.filter((_, index) => {
      return (
        index >= (pageNumber - 1) * rowsPerPage &&
        index < (pageNumber - 1) * rowsPerPage + rowsPerPage
      );
    });
    return pagedRows;
  };

  const onChangeDisplayedParticipants = (
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

  let searchedParticipants = participants;
  if (searchText.length > 1) {
    searchedParticipants = participants.filter((item) => {
      const search = searchText.toLowerCase();
      return item.name.toLowerCase().indexOf(search) >= 0;
    });
  }

  const { sortData } = useSortable<ParticipantDTO>();
  const sortedParticipants = sortData(searchedParticipants);

  const pagedRows = getPagedParticipants(sortedParticipants);

  return (
    <div className='participants-table-container'>
      <div className='participants-table-header'>
        <div className='participants-table-header-right'>
          <div className='participants-search-bar-container'>
            <input
              type='text'
              className='participants-search-bar'
              onChange={handleSearch}
              placeholder='Search participants'
              value={searchText}
            />
            <FontAwesomeIcon icon='search' className='participants-search-bar-icon' />
          </div>
        </div>
      </div>
      <table className='participants-table'>
        <thead>
          <tr>
            <SortableTableHeader<ParticipantDTO> sortKey='name' header='Name' />
            <th>Participant Type</th>
            <SortableTableHeader<ParticipantDTO> sortKey='approver' header='Approver' />
            <SortableTableHeader<ParticipantDTO> sortKey='dateApproved' header='Date Approved' />
            <th>API Permissions</th>
            <SortableTableHeader<ParticipantDTO>
              sortKey='crmAgreementNumber'
              header='Salesforce Agreement Number'
            />
            <th className='action'>Action</th>
          </tr>
        </thead>

        <tbody>
          {pagedRows.map((participant) => (
            <ParticipantManagmentItem
              key={participant.id}
              participant={participant}
              participantTypes={participantTypes}
              apiRoles={apiRoles}
              onUpdateParticipant={onUpdateParticipant}
            />
          ))}
        </tbody>
      </table>
      {participants.length > 0 && searchText && searchedParticipants.length === 0 && (
        <TableNoDataPlaceholder
          icon={<img src='/document.svg' alt='email-icon' />}
          title='No Participants'
        >
          <span>There are no participants that match this search.</span>
        </TableNoDataPlaceholder>
      )}
      {!participants.length && <NoParticipants />}
      {!!searchedParticipants.length && (
        <PagingTool
          numberTotalRows={searchedParticipants.length}
          initialPageNumber={pageNumber}
          onChangeRows={onChangeDisplayedParticipants}
        />
      )}
    </div>
  );
}

export default function ParticipantManagementTable(props: ParticipantManagementTableProps) {
  return (
    <SortableProvider>
      <ParticipantManagementTableContent {...props} />
    </SortableProvider>
  );
}
