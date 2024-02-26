import Fuse from 'fuse.js';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { UserRole } from '../../../api/entities/User';
import { GetRecommendedRolesById, SiteDTO } from '../../../api/services/adminServiceHelpers';
import { AddParticipantForm } from '../../services/participant';
import { useSiteList } from '../../services/site';
import { sortApiRoles } from '../../utils/apiRoles';
import { Dialog } from '../Core/Dialog';
import { CheckboxInput } from '../Input/CheckboxInput';
import { Input } from '../Input/Input';
import { RadioInput } from '../Input/RadioInput';
import { SelectInput } from '../Input/SelectInput';
import { TextInput } from '../Input/TextInput';
import { SearchBarContainer, SearchBarInput, SearchBarResults } from '../Search/SearchBar';
import { HighlightedResult } from './ParticipantApprovalForm';

import './AddParticipantDialog.scss';

type AddParticipantDialogProps = {
  triggerButton: JSX.Element;
  onAddParticipant: (form: AddParticipantForm) => Promise<void>;
  apiRoles: ApiRoleDTO[];
  participantTypes: ParticipantTypeDTO[];
};

function AddParticipantDialog({
  triggerButton,
  onAddParticipant,
  apiRoles,
  participantTypes,
}: AddParticipantDialogProps) {
  const { sites } = useSiteList();
  const fuse = useMemo(
    () =>
      sites
        ? new Fuse(sites!, { keys: ['name'], includeMatches: true, findAllMatches: true })
        : null,
    [sites]
  );
  const [open, setOpen] = useState(false);
  const [siteSearchResults, setSiteSearchResults] = useState<Fuse.FuseResult<SiteDTO>[]>();
  const [searchText, setSearchText] = useState('');
  const [selectedSite, setSelectedSite] = useState<SiteDTO>();

  const formMethods = useForm<AddParticipantForm>();
  const { register, setValue, watch, handleSubmit, reset } = formMethods;

  useEffect(() => {
    setSiteSearchResults(fuse?.search(searchText));
  }, [fuse, searchText]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'participantTypes') {
        const types = value.participantTypes;
        const roles = GetRecommendedRolesById(types as number[]);
        setValue('apiRoles', roles);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, reset, open]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (formData: AddParticipantForm) => {
    await onAddParticipant(formData);
    setOpen(false);
  };

  const onSiteClick = (site: SiteDTO) => {
    setValue('siteId', site.id);
    setSelectedSite(site);
  };

  const onSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <Dialog
      triggerButton={triggerButton}
      title='Add Participant'
      closeButtonText='Cancel'
      open={open}
      onOpenChange={setOpen}
      className='add-participant-dialog'
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4>Participant Information</h4>
          <span>Provide the following information about the company/participant</span>
          <div className='add-participant-dialog-flex'>
            <div>
              <TextInput
                inputName='participantName'
                label='Participant Name'
                className='text-input'
                rules={{ required: 'Please specify Participant Name.' }}
              />
            </div>

            <div className='right-column'>
              <CheckboxInput
                inputName='participantTypes'
                label='Participant Type'
                options={participantTypes.map((p) => ({
                  optionLabel: p.typeName,
                  value: p.id,
                }))}
                rules={{ required: 'Please specify Participant Type(s).' }}
              />
            </div>
          </div>
          <div>
            <div className='add-participant-dialog-flex'>
              <div className='left-column site-type'>
                <RadioInput
                  inputName='siteIdType'
                  label='Site ID'
                  options={[
                    { optionLabel: 'Existing Site ID', value: 0, checked: true },
                    { optionLabel: 'New Site ID', value: 1, disabled: true },
                  ]}
                />
              </div>
              <div className='right-column'>
                <SearchBarContainer>
                  <Input
                    inputName='participantSearch'
                    label='Search Participant Name to find Site ID'
                  >
                    <SearchBarInput
                      inputClassName='search-input'
                      fullBorder
                      value={
                        !selectedSite
                          ? searchText
                          : `${selectedSite.name} (Site ID ${selectedSite.id})`
                      }
                      onChange={onSearchInputChange}
                      onFocus={() => setSelectedSite(undefined)}
                    />
                  </Input>
                  {!selectedSite && searchText && (
                    <SearchBarResults className='site-search-results'>
                      {siteSearchResults?.map((s) => (
                        <button
                          key={s.item.id}
                          type='button'
                          className='text-button'
                          onClick={() => onSiteClick(s.item)}
                        >
                          <HighlightedResult result={s} /> (Site ID: {s.item.id})
                        </button>
                      ))}
                    </SearchBarResults>
                  )}
                </SearchBarContainer>
                <input type='hidden' {...register('siteId')} />
              </div>
            </div>
          </div>
          <div className='add-participant-dialog-flex'>
            <div className='left-column user-roles'>
              <SelectInput
                inputName='role'
                label='Job Function'
                rules={{ required: 'Please specify your job function.' }}
                options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
                  optionLabel: UserRole[key],
                  value: UserRole[key],
                }))}
              />
            </div>
            <div className='right-column'>
              <CheckboxInput
                inputName='apiRoles'
                label='API Roles'
                options={sortApiRoles(apiRoles).map((p) => ({
                  optionLabel: p.externalName,
                  optionToolTip: p.roleName,
                  value: p.id,
                }))}
                rules={{ required: 'Please specify API Role(s).' }}
              />
            </div>
          </div>
          <div>
            <h4>Participant Contact Information</h4>
            <span>
              Enter the information of the participant who is requesting the account. An email will
              be sent to the contact with instructions to access the account.
            </span>
            <div className='add-participant-dialog-flex'>
              <div>
                <TextInput
                  inputName='firstName'
                  label='Contact First Name'
                  className='text-input'
                  rules={{ required: 'Please specify Contact First Name.' }}
                />
                <TextInput
                  inputName='email'
                  label='Contact Email'
                  className='text-input'
                  rules={{ required: 'Please specify Contact Email.' }}
                />
              </div>
              <div className='right-column'>
                <TextInput
                  inputName='lastName'
                  label='Contact Last Name'
                  className='text-input'
                  rules={{ required: 'Please specify Contact Last Name.' }}
                />
              </div>
            </div>
          </div>
          <br />
          <div className='request-button'>
            <button type='submit' className='primary-button'>
              Request Account
            </button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default AddParticipantDialog;
