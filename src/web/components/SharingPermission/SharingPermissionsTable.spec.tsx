import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './SharingPermissionsTable.stories';

const { SharedWithParticipants } = composeStories(stories);

describe('SharingPermissionsTable', () => {
  it('renders correctly with shared participants', async () => {
    render(<SharedWithParticipants />);
    expect(await screen.findByText('Site 1')).toBeInTheDocument();
    expect(await screen.findByText('Site 2')).toBeInTheDocument();
    expect(await screen.findByText('Site 3')).toBeInTheDocument();
    expect(await screen.findByText('Site 4')).toBeInTheDocument();
  });

  it('handles search bar changes', async () => {
    const user = userEvent.setup();

    render(<SharedWithParticipants />);
    const searchInput = screen.getByPlaceholderText('Search sharing permissions');
    await user.type(searchInput, 'Site 1');
    expect(searchInput).toHaveValue('Site 1');
  });

  it('renders delete permissions button when there are permissions selected', async () => {
    const user = userEvent.setup();
    render(<SharedWithParticipants />);

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(firstCheckbox);

    expect(screen.getByRole('button', { name: /Delete Permissions/i })).toBeInTheDocument();
  });

  it('shows participants included by site ID even if they are not a valid sharing target', () => {
    render(<SharedWithParticipants />);
    expect(screen.getByText('No SHARER and explicitly included')).toBeInTheDocument();
  });

  it('does not show participants that are included by group if they are not a valid sharing target', () => {
    render(<SharedWithParticipants />);
    screen.getByText('Site 1');
    expect(screen.queryByText('No SHARER and not explicitly included')).not.toBeInTheDocument();
  });
});
