import { Meta } from '@storybook/react-webpack5';

import { ClientType } from '../../../api/services/adminServiceHelpers';
import { ParticipantItem } from './ParticipantItem';

const meta: Meta<typeof ParticipantItem> = {
  title: 'Sharing Permissions/Participant Item',
  component: ParticipantItem,
  decorators: [
    (Story) => (
      <table>
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};

export default meta;

export const Checked = {
  args: {
    site: {
      id: 1,
      name: 'Participant 1',
      clientTypes: ['DSP'] as ClientType[],
      canBeSharedWith: true,
    },
    onClick: () => {},
    checked: true,
  },
};

export const Unchecked = {
  args: {
    site: {
      id: 2,
      name: 'Participant 2',
      clientTypes: ['DSP'] as ClientType[],
      canBeSharedWith: true,
    },
    onClick: () => {},
    checked: false,
  },
};

export const AddedByManual = {
  args: {
    site: {
      id: 2,
      name: 'Participant 2',
      clientTypes: ['DSP'],
      canBeSharedWith: true,
      addedBy: ['Manual'],
    },
    onClick: () => {},
    checked: false,
  },
};

export const AddedByAuto = {
  args: {
    site: {
      id: 2,
      name: 'Participant 2',
      clientTypes: ['DSP', 'PUBLISHER'],
      canBeSharedWith: true,
      addedBy: ['DSP'],
    },
    onClick: () => {},
    checked: false,
  },
};

export const AddedByAutoAndManual = {
  args: {
    site: {
      id: 2,
      name: 'Participant 2',
      clientTypes: ['DSP', 'PUBLISHER'],
      addedBy: ['Manual', 'DSP', 'PUBLISHER'],
      canBeSharedWith: true,
    },
    onClick: () => {},
    checked: false,
  },
};
