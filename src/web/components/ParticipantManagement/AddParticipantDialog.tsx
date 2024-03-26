import { AxiosResponse } from 'axios';
import Fuse from 'fuse.js';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { UserRole } from '../../../api/entities/User';
import { SiteDTO } from '../../../api/services/adminServiceHelpers';
import { AddParticipantForm } from '../../services/participant';
import { useSiteList } from '../../services/site';
import { sortApiRoles } from '../../utils/apiRoles';
import { extractMessageFromAxiosError } from '../../utils/errorHelpers';
import { Dialog } from '../Core/Dialog';
import { SuccessToast } from '../Core/Toast';
import { RootFormErrors } from '../Input/FormError';
import { MultiCheckboxInput } from '../Input/MultiCheckboxInput';
import { RadioInput } from '../Input/RadioInput';
import { SelectInput } from '../Input/SelectInput';
import { TextInput } from '../Input/TextInput';
import { SearchBarContainer, SearchBarFormInput, SearchBarResults } from '../Search/SearchBar';
import { HighlightedResult } from './ParticipantApprovalForm';

import './AddParticipantDialog.scss';

type AddParticipantDialogProps = {
  triggerButton: JSX.Element;
  onAddParticipant: (form: AddParticipantForm) => Promise<AxiosResponse>;
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
  const [newSite, setNewSite] = useState(false);

  const formMethods = useForm<AddParticipantForm>({ defaultValues: { siteIdType: 0 } });
  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    setSiteSearchResults(fuse?.search(searchText));
  }, [fuse, searchText]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'siteIdType') {
        const type = value.siteIdType;
        setNewSite(type === 1);
        setValue('apiRoles', []);
      }
      if (name === 'participantName') {
        setValue('siteName', value.participantName!);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, open]);

  useEffect(() => {
    if (!open) {
      // the dialog doesn't de-render on close, so we need to clean up our state
      setSearchText('');
      setSiteSearchResults(undefined);
      setSelectedSite(undefined);
      setNewSite(false);
      reset();
    }
  }, [open, reset]);

  const onSubmit = useCallback(
    async (formData: AddParticipantForm) => {
      const response = await onAddParticipant(formData);
      if (response.status === 200) {
        SuccessToast('Participant Added.');
      }
      setOpen(false);
    },
    [onAddParticipant]
  );

  const submit = useCallback(
    async (formData: AddParticipantForm) => {
      try {
        await onSubmit(formData);
      } catch (err) {
        const message =
          extractMessageFromAxiosError(err as Error) ?? 'Something went wrong, please try again';

        setError('root.serverError', {
          type: '400',
          message,
        });
      }
    },
    [onSubmit, setError]
  );

  const onSiteClick = (site: SiteDTO) => {
    setValue('siteId', site.id);
    setValue(
      'apiRoles',
      site.apiRoles.map((role) => role.id)
    );
    setSelectedSite(site);
  };

  const onSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const onSearchInputFocus = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedSite(undefined);
    setValue('siteId', undefined);
  };

  return (
    <Dialog
      triggerButton={triggerButton}
      title='Add Participant'
      closeButtonText='Cancel'
      open={open}
      onOpenChange={setOpen}
      className='add-participant-dialog'
      hideActionCloseButtonOnly
    >
      <RootFormErrors fieldErrors={errors} />
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(submit)}>
          <div>
            <h4>Participant Information</h4>
            <span>Provide the following information about the company/participant.</span>
            <TextInput
              inputName='participantName'
              label='Participant Name'
              className='text-input'
              rules={{ required: 'Please specify Participant Name.' }}
            />

            <MultiCheckboxInput
              inputName='participantTypes'
              label='Participant Type'
              options={participantTypes.map((p) => ({
                optionLabel: p.typeName,
                value: p.id,
              }))}
              rules={{ required: 'Please specify Participant Type(s).' }}
            />
            <div className='site-type'>
              <RadioInput
                inputName='siteIdType'
                label='Site ID'
                options={[
                  { optionLabel: 'Existing Site ID', value: 0 },
                  { optionLabel: 'New Site ID', value: 1 },
                ]}
              />
            </div>
            {!newSite && (
              <div>
                <SearchBarContainer>
                  <SearchBarFormInput
                    inputName='siteId'
                    inputClassName='search-input'
                    fullBorder
                    value={
                      !selectedSite
                        ? searchText
                        : `${selectedSite.name} (Site ID ${selectedSite.id})`
                    }
                    onChange={onSearchInputChange}
                    onFocus={onSearchInputFocus}
                    label='Search Participant Name to find Site ID'
                    rules={{ required: 'Please specify Site ID.' }}
                  />
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
              </div>
            )}
            {newSite && (
              <TextInput
                inputName='siteName'
                label='New Site Name'
                className='text-input'
                rules={{ required: 'Please specify Site Name.' }}
                disabled
              />
            )}
            <div className='add-participant-dialog-flex'>
              <MultiCheckboxInput
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
            <div>
              <h4>Participant Contact Information</h4>
              <span>
                Enter the information of the participant who is requesting the account. An email
                will be sent to the contact with instructions to access the account.
              </span>
              <div className='add-participant-dialog-flex'>
                <div>
                  <TextInput
                    inputName='firstName'
                    label='Contact First Name'
                    className='text-input'
                    rules={{ required: 'Please specify Contact First Name.' }}
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
              <div className='add-participant-dialog-flex'>
                <div>
                  <TextInput
                    inputName='email'
                    label='Contact Email'
                    className='text-input'
                    rules={{ required: 'Please specify Contact Email.' }}
                  />
                </div>
                <div className='user-roles right-column'>
                  <SelectInput
                    inputName='role'
                    label='Job Function'
                    options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
                      optionLabel: UserRole[key],
                      value: UserRole[key],
                    }))}
                  />
                </div>
              </div>
            </div>
            <br />
            <div className='action-container'>
              <div className='request-button'>
                <button type='submit' className='primary-button'>
                  Add Participant
                </button>
              </div>
              <div className='cancel-button'>
                <button type='button' className='transparent-button' onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default AddParticipantDialog;
