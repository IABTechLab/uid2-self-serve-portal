import { useMemo, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../../api/routers/participantsRouter';
import { ParticipantApprovalFormDetails } from '../../services/participant';
import { useSiteList } from '../../services/site';
import { Form } from '../Core/Form';
import { CheckboxInput } from '../Input/CheckboxInput';
import { Input } from '../Input/Input';
import { TextInput } from '../Input/TextInput';
import { SearchBarContainer, SearchBarInput, SearchBarResults } from '../Search/SearchBar';

import './ParticipantApprovalForm.scss';

type ParticipantApprovalFormProps = {
  onApprove: (formData: ParticipantApprovalFormDetails) => Promise<void>;
  participant: ParticipantRequestDTO;
  participantTypes: ParticipantTypeDTO[];
};
function ParticipantApprovalForm({
  onApprove,
  participant,
  participantTypes,
}: ParticipantApprovalFormProps) {
  const { sites } = useSiteList();
  const [searchText, setSearchText] = useState(participant.name);
  const onSubmit: SubmitHandler<ParticipantApprovalFormDetails> = async (formData) => {
    await onApprove(formData);
  };

  const formatParticipantToFormValues = useMemo(
    () => ({ name: participant.name, types: participant.types?.map((t) => t.id) }),
    [participant]
  );

  return (
    <div className='participant-approval-form'>
      <div>
        To approve a participant please search Site IDs to see if they are already signed up.
      </div>
      <ul>
        <li>{participant.name}</li>
      </ul>
      <SearchBarContainer>
        <Input inputName='participantSearch' label='Search Participant Name to find Site ID'>
          <SearchBarInput inputClassName='search-input' fullBorder value={searchText} />
        </Input>
        <SearchBarResults>
          {sites?.map((s) => (
            <div>{s.name}</div>
          ))}
        </SearchBarResults>
      </SearchBarContainer>
      <Form<ParticipantApprovalFormDetails>
        onSubmit={onSubmit}
        submitButtonText='Approve Participant'
        defaultValues={formatParticipantToFormValues}
      >
        <TextInput
          inputName='name'
          label='Participant Name'
          rules={{ required: 'Please specify participant name.' }}
        />
        <TextInput
          inputName='siteId'
          label='Site ID'
          type='number'
          rules={{ required: 'Please specify site id.' }}
        />
        <CheckboxInput
          inputName='types'
          label='Participant Type'
          options={participantTypes.map((p) => ({
            optionLabel: p.typeName,
            value: p.id,
          }))}
          rules={{ required: 'Please specify Participant type.' }}
        />
      </Form>
    </div>
  );
}

export default ParticipantApprovalForm;
