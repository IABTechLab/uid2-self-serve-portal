import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApiRole, ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeySecretsDTO } from '../../../api/services/apiKeyService';
import KeyCreationDialog from './KeyCreationDialog';

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

async function loadComponent(
  availableRoles: { id: number; roleName: string; externalName: string }[],
  openDialog: boolean = true
) {
  const onKeyCreation = jest.fn(() => {
    return Promise.resolve({
      name: 'test_key',
      plaintextKey: 'ABCD',
      secret: '1234',
    });
  });
  const triggerButton = <button type='button'>Open</button>;

  render(
    <KeyCreationDialog
      availableRoles={availableRoles}
      onKeyCreation={onKeyCreation}
      triggerButton={triggerButton}
    />
  );

  if (openDialog) {
    const openButton = screen.getByRole('button', { name: 'Open' });
    await userEvent.click(openButton);
  }

  return onKeyCreation;
}

async function enterApiName(name: string) {
  const nameInput = screen.getByRole('textbox', { name: 'name' });
  await userEvent.type(nameInput, name);
}

async function clickApiRole(apiRole: ApiRoleDTO) {
  await userEvent.click(screen.getByRole('checkbox', { name: apiRole.externalName }));
}

async function submitForm() {
  const createButton = screen.getByRole('button', { name: 'Create API Key' });
  await userEvent.click(createButton);
}

const apiRoleTests = [
  [[{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }]],
  [
    [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
    ],
  ],
  [
    [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
    ],
  ],
  [
    [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer' },
    ],
  ],
];

describe('Key creation dialog', () => {
  test.each(apiRoleTests)('Should should show apiRole external names', async (apiRoles) => {
    await loadComponent(apiRoles);

    for (const role of apiRoles) {
      expect(screen.getByRole('checkbox', { name: role.externalName })).toBeInTheDocument();
    }
  });

  test.each(apiRoleTests)(
    'Should show error when submitting with no roles selected',
    async (apiRoles) => {
      await loadComponent(apiRoles);

      await enterApiName('apiKey');

      await submitForm();

      await waitFor(() => {
        expect(screen.getByText('Please select at least one API Role.')).toBeInTheDocument();
      });
    }
  );

  test.each(apiRoleTests)('should submit form when you choose one role', async (apiRoles) => {
    const onSubmitMock = await loadComponent(apiRoles);

    await enterApiName('key_name');
    await clickApiRole(apiRoles[0]);
    await submitForm();

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        name: 'key_name',
        roles: [apiRoles[0].roleName],
      });
    });
  });

  test.each(apiRoleTests)('should submit form when you choose all roles', async (apiRoles) => {
    const onSubmitMock = await loadComponent(apiRoles);

    await enterApiName('key_name');

    await apiRoles.map(async (apiRole) => {
      await clickApiRole(apiRole);
    });

    await submitForm();

    const expectedValue = {
      name: 'key_name',
      roles: apiRoles.map((apiRole) => apiRole.roleName),
    };

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(expectedValue);
    });
  });

  test.each(apiRoleTests)('Should display key after form submitted', async (apiRoles) => {
    const onSubmitMock = await loadComponent(apiRoles);

    await enterApiName('key_name');
    await clickApiRole(apiRoles[0]);
    await submitForm();

    expect(screen.getByText('ABCD')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('Should make you copy secrets before closing the dialog', async () => {
    const apiRoles = [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
    ];

    await loadComponent(apiRoles);

    await enterApiName('key_name');
    await clickApiRole(apiRoles[0]);
    await submitForm();

    const closeDialogButton = screen.getByText('Close');
    await userEvent.click(closeDialogButton);

    expect(
      screen.getByText('Please copy all secrets shown before closing the page')
    ).toBeInTheDocument();
  });

  it('should let you copy each secret', async () => {
    const apiRoles = [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
    ];

    await loadComponent(apiRoles);

    await enterApiName('key_name');
    await clickApiRole(apiRoles[0]);
    await submitForm();

    const copyButton1 = screen.getAllByText('Copy')[0];
    const copyButton2 = screen.getAllByText('Copy')[1];

    await userEvent.click(copyButton1);
    expect(writeText).lastCalledWith('1234');

    await userEvent.click(copyButton2);
    expect(writeText).lastCalledWith('ABCD');
  });
});
