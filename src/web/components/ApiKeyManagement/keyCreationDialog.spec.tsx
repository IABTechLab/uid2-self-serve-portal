import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApiRoleDTO, apiRoles } from '../../../api/entities/ApiRole';
import KeyCreationDialog from './KeyCreationDialog';

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

async function loadComponent(availableRoles: ApiRoleDTO[], openDialog: boolean = false) {
  const onKeyCreation = jest.fn(() => {
    return Promise.resolve({
      name: 'test_key',
      plaintextKey: 'ABCD',
      secret: '1234',
    });
  });

  render(
    <KeyCreationDialog
      availableRoles={availableRoles}
      onKeyCreation={onKeyCreation}
      onOpenChange={() => {}}
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
  const createButton = screen.getByRole('button', { name: 'Add API Key' });
  await userEvent.click(createButton);
}

const Mapper: ApiRoleDTO = apiRoles.filter((apiRole) => apiRole.externalName === 'Mapper')[0];
const Generator: ApiRoleDTO = apiRoles.filter((apiRole) => apiRole.externalName === 'Generator')[0];
const Bidder: ApiRoleDTO = apiRoles.filter((apiRole) => apiRole.externalName === 'Bidder')[0];
const Sharer: ApiRoleDTO = apiRoles.filter((apiRole) => apiRole.externalName === 'Sharer')[0];

const apiRoleTests = [
  [[Mapper]],
  [[Mapper, Bidder]],
  [[Mapper, Generator, Bidder]],
  [[Mapper, Generator, Bidder, Sharer]],
];

describe('Key creation dialog', () => {
  test.each(apiRoleTests)('Should should show apiRole external names', async (apiRoleTest) => {
    await loadComponent(apiRoleTest);

    for (const role of apiRoleTest) {
      expect(screen.getByRole('checkbox', { name: role.externalName })).toBeInTheDocument();
    }
  });

  test.each(apiRoleTests)(
    'Should show error when submitting with no roles selected',
    async (apiRoleTest) => {
      await loadComponent(apiRoleTest);

      await enterApiName('apiKey');

      await submitForm();

      await waitFor(() => {
        expect(screen.getByText('Please select at least one API permission.')).toBeInTheDocument();
      });
    }
  );

  test.each(apiRoleTests)('should submit form when you choose one role', async (apiRoleTest) => {
    const onSubmitMock = await loadComponent(apiRoleTest);

    await enterApiName('key_name');
    await clickApiRole(apiRoleTest[0]);
    await submitForm();

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        name: 'key_name',
        roles: [apiRoleTest[0].roleName],
      });
    });
  });

  test.each(apiRoleTests)('should submit form when you choose all roles', async (apiRoleTest) => {
    const onSubmitMock = await loadComponent(apiRoleTest);

    await enterApiName('key_name');

    await apiRoleTest.map(async (apiRole) => {
      await clickApiRole(apiRole);
    });

    await submitForm();

    const expectedValue = {
      name: 'key_name',
      roles: apiRoleTest.map((apiRole) => apiRole.roleName),
    };

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(expectedValue);
    });
  });

  test.each(apiRoleTests)('Should display key after form submitted', async (apiRoleTest) => {
    await loadComponent(apiRoleTest);

    await enterApiName('key_name');
    await clickApiRole(apiRoleTest[0]);
    await submitForm();

    expect(screen.getByText('ABCD')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('should let you copy each secret', async () => {
    const apiRoleTest = [Mapper, Bidder];

    await loadComponent(apiRoleTest);

    await enterApiName('key_name');
    await clickApiRole(apiRoleTest[0]);
    await submitForm();

    const copyButton1 = screen.getByTitle('Copy secret to clipboard.');
    const copyButton2 = screen.getByTitle('Copy key to clipboard.');

    await userEvent.click(copyButton1);
    expect(writeText).toHaveBeenLastCalledWith('1234');

    await userEvent.click(copyButton2);
    expect(writeText).toHaveBeenLastCalledWith('ABCD');
  });

  it('should confirm copying before letting user close', async () => {
    const apiRoleTest = [Mapper, Bidder];

    await loadComponent(apiRoleTest);

    await enterApiName('key_name');
    await clickApiRole(apiRoleTest[0]);
    await submitForm();

    await userEvent.click(screen.queryAllByRole('button', { name: 'Close' })[0]);

    expect(
      screen.getByText(
        `Make sure you've copied your API secret and key to a secure location. After you close this page, they are no longer accessible.`
      )
    ).toBeInTheDocument();
  });
});
