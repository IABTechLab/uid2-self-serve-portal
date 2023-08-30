import { ChangeEvent, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../../api/routers/participantsRouter';
import { SiteDTO } from '../../../api/services/adminServiceHelpers';
import { ParticipantApprovalFormDetails } from '../../services/participant';
import { useSiteList } from '../../services/site';
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
  const [searchText] = useState(participant.name);
  const [selectedSite, setSelectedSite] = useState<SiteDTO>();

  const formMethods = useForm<ParticipantApprovalFormDetails>({
    defaultValues: { name: participant.name, types: participant.types?.map((t) => t.id) },
  });
  const { register, handleSubmit, setValue } = formMethods;

  const onSubmit = async (data: ParticipantApprovalFormDetails) => {
    await onApprove(data);
  };

  const onSiteClick = (site: SiteDTO) => {
    setValue('siteId', site.id);
    setSelectedSite(site);
  };

  const onSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    // This feature still under development :)
    // setSearchText(event.target.value);
  };

  const getSiteText = (site: SiteDTO) => `${site.name} (Site ID ${site.id})`;

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
          <SearchBarInput
            inputClassName='search-input'
            fullBorder
            value={!selectedSite ? searchText : getSiteText(selectedSite)}
            onChange={onSearchInputChange}
            onFocus={() => setSelectedSite(undefined)}
          />
        </Input>
        {!selectedSite && (
          <SearchBarResults className='site-search-results'>
            {sites?.map((s) => (
              <button type='button' className='text-button' onClick={() => onSiteClick(s)}>
                {getSiteText(s)}
              </button>
            ))}
          </SearchBarResults>
        )}
      </SearchBarContainer>
      {!!selectedSite && (
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              inputName='name'
              label='Participant Name'
              rules={{ required: 'Please specify participant name.' }}
            />
            <input type='hidden' {...register('siteId')} />
            <CheckboxInput
              inputName='types'
              label='Participant Type'
              rules={{ required: 'Please specify Participant type.' }}
              options={participantTypes.map((p) => ({
                optionLabel: p.typeName,
                value: p.id,
              }))}
            />
            <Input inputName='readonly-requestor-name' label='Requestor Name'>
              <input
                className='input-container'
                disabled
                value={participant.requestingUser.fullName}
              />
            </Input>
            <Input inputName='readonly-requestor-email' label='Requestor Email'>
              <input
                className='input-container'
                disabled
                value={participant.requestingUser.email}
              />
            </Input>
            <Input inputName='readonly-requestor-job' label='Job Function'>
              <input className='input-container' disabled value={participant.requestingUser.role} />
            </Input>
            <div className='form-footer'>
              <button type='submit' className='primary-button'>
                Approve Participant
              </button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
}

export default ParticipantApprovalForm;
