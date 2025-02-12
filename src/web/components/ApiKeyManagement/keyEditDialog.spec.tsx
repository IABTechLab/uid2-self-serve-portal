/* eslint-disable camelcase */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import KeyEditDialog from './KeyEditDialog';

function loadComponent(apiKeyRoles: ApiRoleDTO[], participantApiRoles: ApiRoleDTO[]) {
  const apiKey: ApiKeyDTO = {
    contact: 'ApiKey',
    name: 'ApiKey',
    created: 1702830516,
    key_id: 'F4lfa.test',
    site_id: 1,
    disabled: false,
    roles: apiKeyRoles,
    service_id: 0,
  };
  const setApiKeyMock = jest.fn(() => {});

  const onEditMock = jest.fn(() => {});

  render(
    <KeyEditDialog
      apiKey={apiKey}
      availableRoles={participantApiRoles}
      onEdit={onEditMock}
      setApiKey={setApiKeyMock}
      onOpenChange={() => {}}
    />
  );

  return { setApiKeyMock, onEditMock };
}

async function submitForm() {
  const saveButton = screen.getByRole('button', { name: 'Save Key' });
  await userEvent.click(saveButton);
}

async function renameKey(newName: string) {
  const nameInput = screen.getByRole('textbox', { name: 'newName' });
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, newName);
}

async function clickRole(role: ApiRoleDTO) {
  await userEvent.click(screen.getByRole('checkbox', { name: role.externalName }));
}

const Mapper: ApiRoleDTO = { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 };
const Generator: ApiRoleDTO = { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 };
const Bidder: ApiRoleDTO = { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 };
const Sharer: ApiRoleDTO = { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 };

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
    'Should show the correct initial values with test array %#',
    (apiKeyRoles, participantApiRoles) => {
      it('should prefill name input', async () => {
        loadComponent(apiKeyRoles, participantApiRoles);

        expect(screen.getByRole('textbox', { name: 'newName' })).toHaveValue('ApiKey');
      });

      it('should select the apiKey roles', async () => {
        loadComponent(apiKeyRoles, participantApiRoles);

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

        await submitForm();

        expect(onEditMock).toHaveBeenCalledWith(
          {
            keyId: 'F4lfa.test',
            newName: 'ApiKey',
            newApiRoles: apiKeyRoles.map((role) => role.roleName),
          },
          setApiKeyMock
        );
      });
    }
  );

  describe('should return the correct values key after being edited', () => {
    it('should allow the key to be renamed', async () => {
      const { onEditMock, setApiKeyMock } = loadComponent([Mapper], [Mapper]);

      await renameKey('ApiKey Rename');

      await submitForm();

      expect(onEditMock).toHaveBeenLastCalledWith(
        {
          keyId: 'F4lfa.test',
          newName: 'ApiKey Rename',
          newApiRoles: ['MAPPER'],
        },
        setApiKeyMock
      );
    });
    it('should show an error on submission if no roles selected', async () => {
      loadComponent([Mapper], [Mapper]);

      await renameKey('ApiKey Rename');
      await clickRole(Mapper);

      await submitForm();

      expect(screen.getByText('Please select at least one API permission.')).toBeInTheDocument();
    });

    it.each([
      [[Mapper], [Bidder]],
      [[Mapper], [Bidder, Mapper]],
      [[Mapper, Sharer], [Bidder]],
      [
        [Mapper, Sharer],
        [Mapper, Bidder],
      ],
    ])(
      'should allow a role to be added with test array %#',
      async (apiKeyRoles, participantApiRoles) => {
        const { onEditMock, setApiKeyMock } = loadComponent(apiKeyRoles, participantApiRoles);

        await clickRole(Bidder);

        await submitForm();

        expect(onEditMock).toHaveBeenCalledWith(
          {
            keyId: 'F4lfa.test',
            newName: 'ApiKey',
            newApiRoles: [...apiKeyRoles, Bidder].map((role) => role.roleName),
          },
          setApiKeyMock
        );
      }
    );

    it.each([
      [[Mapper, Sharer], [Mapper]],
      [
        [Mapper, Sharer],
        [Mapper, Sharer],
      ],
      [[Mapper, Sharer, Generator], [Mapper]],
      [
        [Mapper, Sharer, Generator],
        [Mapper, Sharer, Generator],
      ],
    ])(
      'should allow a role to be removed with test array %#',
      async (apiKeyRoles, participantApiRoles) => {
        const { onEditMock, setApiKeyMock } = loadComponent(apiKeyRoles, participantApiRoles);

        await clickRole(Mapper);

        await submitForm();

        expect(onEditMock).toHaveBeenCalledWith(
          {
            keyId: 'F4lfa.test',
            newName: 'ApiKey',
            newApiRoles: apiKeyRoles.filter((role) => role !== Mapper).map((role) => role.roleName),
          },
          setApiKeyMock
        );
      }
    );
  });
});
