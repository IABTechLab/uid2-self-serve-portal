/* eslint-disable camelcase */
import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from '@testing-library/react';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { EditApiKeyFormDTO } from '../../services/apiKeyService';
import KeyEditDialog, { OnApiKeyEdit } from './KeyEditDialog';
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

  it('should return the correct values with multiple roles', () => {
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

    for (const role of ['ID_READER']) {
      const roleInput = screen.getByDisplayValue(role);
      fireEvent.click(roleInput);
    }

    const saveButton = screen.getByText('Save Key');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);

    expect(onEditMock.mock.calls).toEqual([
      [
        { keyId: 'F4lfa.fdas', newName: 'ApiKey2', newApiRoles: ['MAPPER', 'ID_READER'] },
        setApiKeyMock,
      ],
    ]);
  });
});
