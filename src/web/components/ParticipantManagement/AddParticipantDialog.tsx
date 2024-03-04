import Fuse from 'fuse.js';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { UserRole } from '../../../api/entities/User';
import { GetRecommendedRolesById, SiteDTO } from '../../../api/services/adminServiceHelpers';
import { AddParticipantForm } from '../../services/participant';
import { useSiteList } from '../../services/site';
import { sortApiRoles } from '../../utils/apiRoles';
import { extractMessageFromAxiosError } from '../../utils/errorHelpers';
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

  const formMethods = useForm<AddParticipantForm>({ defaultValues: { siteIdType: 0 } });
  const {
    register,
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
      if (name === 'participantTypes') {
        const types = value.participantTypes;
        const roles = GetRecommendedRolesById(types as number[]);
        setValue('apiRoles', roles);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, open]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = useCallback(
    async (formData: AddParticipantForm) => {
      await onAddParticipant(formData);
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
      {errors.root?.serverError && (
        <p className='form-error' data-testid='formError'>
          {errors.root?.serverError.message}
        </p>
      )}
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(submit)}>
          <h4>Participant Information</h4>
          <span>Provide the following information about the company/participant.</span>
          <div className='add-participant-dialog-flex'>
            <TextInput
              inputName='participantName'
              label='Participant Name'
              className='text-input'
              rules={{ required: 'Please specify Participant Name.' }}
            />

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
              <div className='site-type'>
                <RadioInput
                  inputName='siteIdType'
                  label='Site ID'
                  options={[
                    { optionLabel: 'Existing Site ID', value: 0 },
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
              <div>
                <div className='user-roles right-column'>
                  <SelectInput
                    inputName='role'
                    label='Job Function'
                    rules={{ required: "Please specify the contact's job function." }}
                    options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => ({
                      optionLabel: UserRole[key],
                      value: UserRole[key],
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className='request-button'>
            <button type='submit' className='primary-button'>
              Add Participant
            </button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default AddParticipantDialog;
