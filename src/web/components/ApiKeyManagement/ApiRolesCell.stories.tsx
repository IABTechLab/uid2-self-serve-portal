import type { Meta, StoryObj } from '@storybook/react';

import ApiRolesCell from './ApiRolesCell';

const meta: Meta<typeof ApiRolesCell> = {
  component: ApiRolesCell,
  title: 'ApiManagement/Api Roles cell',
  decorators: [
    (Story) => (
      <div>
        <table>
          <thead>
            <tr>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Story />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ApiRolesCell>;

export const ManyRole: Story = {
  args: {
    apiRoles: [
      { id: 1, roleName: 'Role1', externalName: 'Role 1' },
      { id: 2, roleName: 'Role2', externalName: 'Role 2' },
      { id: 3, roleName: 'Role3', externalName: 'Role 3' },
    ],
  },
};

export const OneRole: Story = {
  args: {
    apiRoles: [{ id: 1, roleName: 'Role1', externalName: 'Role 1' }],
  },
};

export const NoRole: Story = {
  args: {
    apiRoles: [],
  },
};
