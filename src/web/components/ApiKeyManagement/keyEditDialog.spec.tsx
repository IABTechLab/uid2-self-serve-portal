/* eslint-disable camelcase */
import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import KeyEditDialog from './KeyEditDialog';
import * as stories from './KeyEditDialog.stories';

const { KeyWithRolesParticipantIsntAllowed, MultipleRoles } = composeStories(stories);

function loadComponent(apiKeyRoles: ApiRoleDTO[], participantApiRoles: ApiRoleDTO[]) {
  const apiKey: ApiKeyDTO = {
    contact: 'ApiKey',
    name: 'ApiKey',
    created: 1702830516,
    key_id: 'F4lfa.fdas',
    site_id: 1,
    disabled: false,
    roles: apiKeyRoles,
    service_id: 0,
  };
  const setApiKeyMock = jest.fn(() => {});

  const onEditMock = jest.fn(() => {});

  const triggerButton = <button type='button'>Open</button>;

  render(
    <KeyEditDialog
      apiKey={apiKey}
      availableRoles={participantApiRoles}
      onEdit={onEditMock}
      triggerButton={triggerButton}
      setApiKey={setApiKeyMock}
    />
  );

  return { setApiKeyMock, onEditMock };
}

async function openDialog() {
  const openButton = screen.getByText('Open');
  await userEvent.click(openButton);
}

async function submitForm() {
  const saveButton = screen.getByRole('button', { name: 'Save Key' });
  await userEvent.click(saveButton);
}

const Mapper = { id: 1, roleName: 'MAPPER', externalName: 'Mapper' };
const Bidder = { id: 3, roleName: 'ID_READER', externalName: 'Bidder' };
const Generator = { id: 2, roleName: 'GENERATOR', externalName: 'Generator' };
const Sharer = { id: 4, roleName: 'SHARER', externalName: 'Sharer' };

const testingValues = [
  [[Bidder], [Bidder]],
  [[Generator], [Sharer]],
  [
    [Mapper, Bidder],
    [Generator, Sharer],
  ],
  [
    [Mapper, Bidder, Generator, Sharer],
    [Mapper, Bidder, Generator, Sharer],
  ],
];

describe('Key edit dialog', () => {
  describe.each(testingValues)(
    'Should show the correct initial values',
    (apiKeyRoles, participantApiRoles) => {
      it('should prefill name input', async () => {
        loadComponent(apiKeyRoles, participantApiRoles);
        await openDialog();

        expect(screen.getByRole('textbox', { name: 'newName' })).toHaveValue('ApiKey');
      });

      it('should select the apiKey roles', async () => {
        loadComponent(apiKeyRoles, participantApiRoles);
        await openDialog();

        for (const role of apiKeyRoles) {
          expect(screen.getByDisplayValue(role.roleName)).toBeChecked();
        }

        const noSelectedApiRoles = participantApiRoles.filter(
          (role) => !apiKeyRoles.includes(role)
        );
        for (const role of noSelectedApiRoles) {
          expect(screen.getByDisplayValue(role.roleName)).not.toBeChecked();
        }
      });

      it('should return the correct value when submitted', async () => {
        const { onEditMock, setApiKeyMock } = loadComponent(apiKeyRoles, participantApiRoles);
        await openDialog();
        await submitForm();

        expect(onEditMock).toHaveBeenCalledWith(
          {
            keyId: 'F4lfa.fdas',
            newName: 'ApiKey',
            newApiRoles: apiKeyRoles.map((role) => role.roleName),
          },
          setApiKeyMock
        );
      });
    }
  );

  it('should return the correct values with one role', async () => {
    const apiKey = {
      contact: 'ApiKey',
      name: 'ApiKey',
      created: 1702830516,
      key_id: 'F4lfa.fdas',
      site_id: 1,
      disabled: false,
      roles: [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }],
      service_id: 0,
    };

    const availableRoles = [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }];

    const setApiKeyMock = () => {};

    const onEditMock = jest.fn(() => {});

    const triggerButton = <button type='button'>Open</button>;

    render(
      <KeyEditDialog
        apiKey={apiKey}
        availableRoles={availableRoles}
        onEdit={onEditMock}
        triggerButton={triggerButton}
        setApiKey={setApiKeyMock}
      />
    );

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    const saveButton = screen.getByRole('button', { name: 'Save Key' });
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Save Key' })).not.toBeInTheDocument();
    });

    expect(onEditMock).toHaveBeenCalledWith(
      {
        keyId: 'F4lfa.fdas',
        newName: 'ApiKey',
        newApiRoles: ['MAPPER'],
      },
      setApiKeyMock
    );
  });

  it('should return the key be renamed', async () => {
    const apiKey = {
      contact: 'ApiKey',
      name: 'ApiKey',
      created: 1702830516,
      key_id: 'F4lfa.fdas',
      site_id: 1,
      disabled: false,
      roles: [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }],
      service_id: 0,
    };

    const availableRoles = [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }];

    const setApiKeyMock = () => {};

    const onEditMock = jest.fn(() => {});

    const triggerButton = <button type='button'>Open</button>;

    render(
      <KeyEditDialog
        apiKey={apiKey}
        availableRoles={availableRoles}
        onEdit={onEditMock}
        triggerButton={triggerButton}
        setApiKey={setApiKeyMock}
      />
    );

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    const nameInput = screen.getByRole('textbox', { name: 'newName' });
    fireEvent.change(nameInput, { target: { value: `ApiKey Rename` } });

    const saveButton = screen.getByRole('button', { name: 'Save Key' });
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Save Key' })).not.toBeInTheDocument();
    });

    expect(onEditMock).toHaveBeenCalledWith(
      {
        keyId: 'F4lfa.fdas',
        newName: 'ApiKey Rename',
        newApiRoles: ['MAPPER'],
      },
      setApiKeyMock
    );
  });
});

it('should show an error if no roles given', async () => {
  const apiKey = {
    contact: 'ApiKey',
    name: 'ApiKey',
    created: 1702830516,
    key_id: 'F4lfa.fdas',
    site_id: 1,
    disabled: false,
    roles: [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }],
    service_id: 0,
  };

  const availableRoles = [
    { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
    { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
    { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
    { id: 4, roleName: 'SHARER', externalName: 'Sharer' },
  ];

  const setApiKeyMock = () => {};

  const onEditMock = jest.fn(() => {});

  const triggerButton = <button type='button'>Open</button>;

  render(
    <KeyEditDialog
      apiKey={apiKey}
      availableRoles={availableRoles}
      onEdit={onEditMock}
      triggerButton={triggerButton}
      setApiKey={setApiKeyMock}
    />
  );

  const openButton = screen.getByText('Open');
  fireEvent.click(openButton);

  fireEvent.click(screen.getByRole('checkbox', { name: 'Mapper' }));

  const saveButton = screen.getByRole('button', { name: 'Save Key' });
  expect(saveButton).toBeInTheDocument();
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(screen.getByText('Please select at least one API Role.')).toBeInTheDocument();
  });
});
