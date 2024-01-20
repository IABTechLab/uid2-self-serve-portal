import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { close } from 'fs';

import { ApiKeySecretsDTO } from '../../../api/services/apiKeyService';
import KeyCreationDialog from './KeyCreationDialog';
import * as stories from './KeyCreationDialog.stories';

const { MultipleRoles, OneRole } = composeStories(stories);

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

describe('Key creation dialog', () => {
  it('Should show one apiRole', () => {
    render(<OneRole />);

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    expect(screen.getByDisplayValue('MAPPER')).not.toBeChecked();
  });

  it('Should show multiple ApiRoles', () => {
    render(<MultipleRoles />);

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    for (const role of ['MAPPER', 'GENERATOR', 'ID_READER']) {
      expect(screen.getByDisplayValue(role)).not.toBeChecked();
    }
  });

  it('should show an error when no roles selected creating key', async () => {
    render(<MultipleRoles />);

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    const nameInput = screen.getByRole('textbox', { name: 'name' });
    fireEvent.change(nameInput, { target: { value: `ApiKey` } });

    const createButton = screen.getByRole('button', { name: 'Create API Key' });
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(screen.getByText('Please select at least one API Role.')).toBeInTheDocument();
    });
  });

  it('should work with one allowed api role', async () => {
    const availableRoles = [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }];
    const onKeyCreation = jest.fn(() => {
      const returnValue: ApiKeySecretsDTO = {
        name: 'test_key',
        plaintextKey: 'ABCD',
        secret: '1234',
      };
      return Promise.resolve(returnValue);
    });
    const triggerButton = <button type='button'>Open</button>;

    render(
      <KeyCreationDialog
        availableRoles={availableRoles}
        onKeyCreation={onKeyCreation}
        triggerButton={triggerButton}
      />
    );

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    const nameInput = screen.getByRole('textbox', { name: 'name' });
    fireEvent.change(nameInput, { target: { value: `test_key` } });

    fireEvent.click(screen.getByRole('checkbox', { name: 'Mapper' }));

    const createButton = screen.getByRole('button', { name: 'Create API Key' });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(onKeyCreation).toHaveBeenCalledWith({ name: 'test_key', roles: ['MAPPER'] });
    });

    await waitFor(() => {
      expect(screen.getByText('ABCD')).toBeInTheDocument();
    });

    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('should work with multiple allowed api role', async () => {
    const availableRoles = [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer' },
    ];
    const onKeyCreation = jest.fn(() => {
      const returnValue: ApiKeySecretsDTO = {
        name: 'test_key',
        plaintextKey: 'ABCD',
        secret: '1234',
      };
      return Promise.resolve(returnValue);
    });
    const triggerButton = <button type='button'>Open</button>;

    render(
      <KeyCreationDialog
        availableRoles={availableRoles}
        onKeyCreation={onKeyCreation}
        triggerButton={triggerButton}
      />
    );

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    const nameInput = screen.getByRole('textbox', { name: 'name' });
    fireEvent.change(nameInput, { target: { value: `test_key` } });

    fireEvent.click(screen.getByRole('checkbox', { name: 'Mapper' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Generator' }));

    const createButton = screen.getByRole('button', { name: 'Create API Key' });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(onKeyCreation).toHaveBeenCalledWith({
        name: 'test_key',
        roles: ['MAPPER', 'GENERATOR'],
      });
    });

    await waitFor(() => {
      expect(screen.getByText('ABCD')).toBeInTheDocument();
    });

    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('should make you copy copy before closing the dialog', async () => {
    const availableRoles = [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }];
    const onKeyCreation = jest.fn(() => {
      const returnValue: ApiKeySecretsDTO = {
        name: 'test_key',
        plaintextKey: 'ABCD',
        secret: '1234',
      };
      return Promise.resolve(returnValue);
    });
    const triggerButton = <button type='button'>Open</button>;

    render(
      <KeyCreationDialog
        availableRoles={availableRoles}
        onKeyCreation={onKeyCreation}
        triggerButton={triggerButton}
      />
    );

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    const nameInput = screen.getByRole('textbox', { name: 'name' });
    fireEvent.change(nameInput, { target: { value: `test_key` } });

    fireEvent.click(screen.getByRole('checkbox', { name: 'Mapper' }));

    const createButton = screen.getByRole('button', { name: 'Create API Key' });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    const closeDialogButton = screen.getByText('Close');
    fireEvent.click(closeDialogButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please copy all secrets shown before closing the page')
      ).toBeInTheDocument();
    });
  });

  it('should let you copy each secret', async () => {
    const availableRoles = [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }];
    const onKeyCreation = jest.fn(() => {
      const returnValue: ApiKeySecretsDTO = {
        name: 'test_key',
        plaintextKey: 'ABCD',
        secret: '1234',
      };
      return Promise.resolve(returnValue);
    });
    const triggerButton = <button type='button'>Open</button>;

    render(
      <KeyCreationDialog
        availableRoles={availableRoles}
        onKeyCreation={onKeyCreation}
        triggerButton={triggerButton}
      />
    );

    const openButton = screen.getByText('Open');
    fireEvent.click(openButton);

    const nameInput = screen.getByRole('textbox', { name: 'name' });
    fireEvent.change(nameInput, { target: { value: `test_key` } });

    fireEvent.click(screen.getByRole('checkbox', { name: 'Mapper' }));

    const createButton = screen.getByRole('button', { name: 'Create API Key' });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    const copyButton1 = screen.getAllByText('Copy')[0];
    const copyButton2 = screen.getAllByText('Copy')[1];

    fireEvent.click(copyButton1);
    await waitFor(() => {
      expect(writeText).lastCalledWith('1234');
    });

    fireEvent.click(copyButton2);
    await waitFor(() => {
      expect(writeText).lastCalledWith('ABCD');
    });
  });
});
