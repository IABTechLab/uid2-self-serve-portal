import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from '@testing-library/react';

import * as stories from './SharingPermissionsTable.stories';

const { SharedWithParticipants, NotShared } = composeStories(stories);

describe('SharingPermissionsTable', () => {
  it('renders correctly when not shared with any participant', () => {
    render(<NotShared />);
    expect(screen.getByText('No Participants')).toBeInTheDocument();
    expect(screen.getByText("You don't have any sharing permissions yet.")).toBeInTheDocument();
  });

  it('renders correctly with shared participants', () => {
    render(<SharedWithParticipants />);
    expect(screen.getByText('Participant 1')).toBeInTheDocument();
    expect(screen.getByText('Participant 2')).toBeInTheDocument();
    expect(screen.getByText('Participant 3')).toBeInTheDocument();
    expect(screen.getByText('Participant 4')).toBeInTheDocument();
    expect(screen.queryByText('No Participants')).not.toBeInTheDocument();
  });

  it('handles search bar changes', () => {
    render(<SharedWithParticipants />);
    const searchInput = screen.getByPlaceholderText('Search sharing permissions');
    fireEvent.change(searchInput, { target: { value: 'Participant 1' } });
    expect(searchInput).toHaveValue('Participant 1');
  });

  it('renders delete permissions button when there are permissions selected', () => {
    render(<SharedWithParticipants />);

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstCheckbox);

    expect(screen.getByText('Delete Permissions')).toBeInTheDocument();
  });
});
