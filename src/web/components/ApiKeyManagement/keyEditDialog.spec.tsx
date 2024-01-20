/* eslint-disable camelcase */
import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import KeyEditDialog, {  } from './KeyEditDialog';
import * as stories from './KeyEditDialog.stories';

const { KeyWithRolesParticipantIsntAllowed, MultipleRoles } = composeStories(stories);

describe('Key edit dialog', () => {
  it('has the correct title', () => {
    render(<MultipleRoles />);

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    expect(screen.getByText('Edit ApiKey')).toBeInTheDocument();
  });

  it('should prefill name input', () => {
    render(<MultipleRoles />);

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    expect(screen.getByRole('textbox', { name: 'newName' })).toHaveValue('ApiKey');
  });

  it('should select the current rows', () => {
    render(<MultipleRoles />);

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    for (const role of ['ID_READER', 'SHARER']) {
      expect(screen.getByDisplayValue(role)).not.toBeChecked();
    }

    for (const role of ['MAPPER', 'GENERATOR']) {
      expect(screen.getByDisplayValue(role)).toBeChecked();
    }
  });

  it('should show both the keys and allowed roles', () => {
    render(<KeyWithRolesParticipantIsntAllowed />);

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    for (const role of ['MAPPER', 'GENERATOR']) {
      expect(screen.getByDisplayValue(role)).toBeChecked();
    }

    for (const role of ['ID_READER']) {
      expect(screen.getByDisplayValue(role)).not.toBeChecked();
    }
  });

  it('should return the correct values with multiple roles', async () => {
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

    fireEvent.click(screen.getByRole('checkbox', { name: 'Bidder' }));

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
        newApiRoles: ['MAPPER', 'ID_READER'],
      },
      setApiKeyMock
    );
  });

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
