import type { Meta, StoryObj } from '@storybook/react';

import ApiRolesCell from './ApiRolesCell';

const meta: Meta<typeof ApiRolesCell> = {
  component: ApiRolesCell,
  title: 'Api Management/Api Roles cell',
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

export const ManyRoleShowingRoleName: Story = {
  args: {
    apiRoles: [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer' },
    ],
    showRoleTooltip: true,
  },
};

export const ManyRole: Story = {
  args: {
    apiRoles: [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
    ],
  },
};

export const OneRole: Story = {
  args: {
    apiRoles: [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }],
  },
};

export const NoRole: Story = {
  args: {
    apiRoles: [],
  },
};
