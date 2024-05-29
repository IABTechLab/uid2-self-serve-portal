import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from '@testing-library/react';

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

  it('handles search bar changes', () => {
    render(<SharedWithParticipants />);
    const searchInput = screen.getByPlaceholderText('Search sharing permissions');
    fireEvent.change(searchInput, { target: { value: 'Site 1' } });
    expect(searchInput).toHaveValue('Site 1');
  });

  it('renders delete permissions button when there are permissions selected', () => {
    render(<SharedWithParticipants />);

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstCheckbox);

    expect(screen.getByText(/Delete Permissions/i)).toBeInTheDocument();
  });

  it('shows participants included by site ID even if they are not a valid sharing target', async () => {
    render(<SharedWithParticipants />);
    expect(await screen.findByText('No SHARER and explicitly included')).toBeInTheDocument();
  });

  it('does not show participants that are included by group if they are not a valid sharing target', async () => {
    render(<SharedWithParticipants />);
    await screen.findByText('Site 1');
    expect(screen.queryByText('No SHARER and not explicitly included')).not.toBeInTheDocument();
  });
});
