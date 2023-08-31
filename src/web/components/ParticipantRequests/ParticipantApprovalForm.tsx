import clsx from 'clsx';
import Fuse from 'fuse.js';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
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

const getSpans = (matches: [number, number][], totalLength: number) => {
  const spans = matches
    .reduce(
      (acc, next) => {
        const gapFromPrevious = {
          start: acc[acc.length - 1].end + 1,
          end: next[0] - 1,
          highlight: false,
        };
        return [...acc, gapFromPrevious, { start: next[0], end: next[1], highlight: true }];
      },
      [{ start: -1, end: -1, highlight: false }]
    )
    .slice(1); // ?
  const finalSpan = {
    start: matches.length > 0 ? matches[matches.length - 1][1] + 1 : 0,
    end: totalLength - 1,
    highlight: false,
  };
  return [...spans, finalSpan]; // ?
};

type HighlightedResultProps = {
  result: Fuse.FuseResult<SiteDTO>;
};
export function HighlightedResult({ result }: HighlightedResultProps) {
  const text = `${result.item.name} (Site ID ${result.item.id})`;
  if (!result.matches || result.matches.length < 1) return <span>{text}</span>;
  const spans = getSpans([...result.matches[0].indices], result.item.name.length);
  return (
    <>
      {spans.map((s) => (
        <span key={`${s.start}-${s.end}`} className={clsx({ highlight: s.highlight })}>
          {result.item.name.slice(s.start, s.end + 1)}
        </span>
      ))}
    </>
  );
}

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
  const fuse = useMemo(
    () =>
      sites
        ? new Fuse(sites!, { keys: ['name'], includeMatches: true, findAllMatches: true })
        : null,
    [sites]
  );
  console.log('Participant:', participant);
  console.log('Sites:', sites);
  const [siteSearchResults, setSiteSearchResults] = useState<Fuse.FuseResult<SiteDTO>[]>();
  const [searchText, setSearchText] = useState(participant.name);
  const [selectedSite, setSelectedSite] = useState<SiteDTO>();

  useEffect(() => {
    setSiteSearchResults(fuse?.search(searchText ?? participant.name));
  }, [sites]);

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
    setSearchText(event.target.value);
    const matches = fuse?.search(event.target.value);
    console.log('Matches', matches);
    setSiteSearchResults(matches);
  };

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
            value={!selectedSite ? searchText : `${selectedSite.name} (Site ID ${selectedSite.id})`}
            onChange={onSearchInputChange}
            onFocus={() => setSelectedSite(undefined)}
          />
        </Input>
        {!selectedSite && (
          <SearchBarResults className='site-search-results'>
            {siteSearchResults?.map((s) => (
              <button type='button' className='text-button' onClick={() => onSiteClick(s.item)}>
                <HighlightedResult result={s} /> (Site ID: {s.item.id})
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
