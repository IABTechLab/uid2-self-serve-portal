import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, within } from '@testing-library/react';

import * as stories from './BulkAddPermissions.stories';

const { Publisher, HasSharedWithPublisher } = composeStories(stories);

describe('BulkAddPermissions', () => {
  it('DSP checkbox is initially checked for a Publisher', async () => {
    render(<Publisher />);
    const dspCheckbox = await screen.findByTestId('dsp');

    expect(dspCheckbox).toHaveAttribute('data-state', 'checked');
  });
  it('Renders "View Participants" button when there are checkboxes selected', () => {
    render(<Publisher />);
    expect(screen.getByRole('button', { name: 'View Participants' })).toBeInTheDocument();
  });
  it('Hides "View Participants" button when no checkboxes selected', () => {
    render(<Publisher />);
    const dspCheckbox = screen.getByTestId('dsp');

    // uncheck DSP
    fireEvent.click(dspCheckbox);

    expect(screen.queryByRole('button', { name: 'View Participants' })).not.toBeInTheDocument();
  });
  it('Displays DSP participants when clicking "View Participants" as a Publisher', () => {
    render(<Publisher />);

    fireEvent.click(screen.getByRole('button', { name: 'View Participants' }));
    const participantsTable = screen.getByRole('table');

    expect(within(participantsTable).getAllByText('DSP')[0]).toBeInTheDocument();
  });
  it('Shows warning when removing a shared type', () => {
    render(<HasSharedWithPublisher />);

    // Expand collapsible
    fireEvent.click(screen.getByRole('button'));
    const publisherCheckbox = screen.getByTestId('publisher');

    // uncheck Publisher
    fireEvent.click(publisherCheckbox);

    expect(
      screen.getByText(
        'If you remove the sharing permissions for a participant type, all sharing permissions of that type are removed, including future participants of that type.'
      )
    ).toBeInTheDocument();
  });
  it('Publisher checkbox is checked when participant has shared with Publisher', () => {
    render(<HasSharedWithPublisher />);

    // Expand collapsible
    fireEvent.click(screen.getByRole('button'));
    const publisherCheckbox = screen.getByTestId('publisher');

    expect(publisherCheckbox).toHaveAttribute('data-state', 'checked');
  });
});
