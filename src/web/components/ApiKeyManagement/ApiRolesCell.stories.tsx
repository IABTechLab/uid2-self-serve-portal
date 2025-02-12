import type { Meta, StoryObj } from '@storybook/react';
import { Mapper, Generator, Bidder, allApiRoles } from './KeyHelper.spec';

import ApiRolesCell from './ApiRolesCell';

const meta: Meta<typeof ApiRolesCell> = {
  component: ApiRolesCell,
  title: 'API Management/API Roles Cell',
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
    apiRoles: allApiRoles,
    showRoleTooltip: true,
  },
};

export const ManyRole: Story = {
  args: {
    apiRoles: [Mapper, Generator, Bidder],
  },
};

export const OneRole: Story = {
  args: {
    apiRoles: [Mapper],
  },
};

export const NoRole: Story = {
  args: {
    apiRoles: [],
  },
};
