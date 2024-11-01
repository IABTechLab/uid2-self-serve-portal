import Joyride from 'react-joyride';

export type VersionedTourStep = React.ComponentProps<typeof Joyride>['steps'][number] & {
  version: string;
};
// Temporary solution: all tour steps without a version are treated as relevant to the current version.
// Update the version after release to avoid showing it again. We can automate this in the release pipeline.
export const tourSteps: VersionedTourStep[] = [
  {
    target: `.profile-dropdown-button`,
    content: `We've moved some menu items to your profile dropdown.`,
    disableBeacon: true,
    title: `Menu Items to Profile Dropdown`,
    version: '0.36.0',
  },
  {
    target: `.participant-switcher`,
    content: `You can now switch between participants that you have access to, and view or complete actions for the selected participant.`,
    disableBeacon: true,
    title: `Participant Switcher`,
    version: '0.49.0',
  },
  {
    target: `.profile-dropdown-button`,
    content: `Within this menu, we've added a new item, Audit Trail, where you can view details of all past actions for the selected participant.`,
    disableBeacon: true,
    title: 'Audit Trail',
    version: '0.49.0',
  },
];
