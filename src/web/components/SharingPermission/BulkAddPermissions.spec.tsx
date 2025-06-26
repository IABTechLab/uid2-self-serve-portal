import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './BulkAddPermissions.stories';
import { BulkAddPermissions } from './BulkAddPermissions';

const { Publisher, HasSharedWithPublisher } = stories;

describe('BulkAddPermissions', () => {
  it('DSP checkbox is initially checked for a Publisher', async () => {
    render(<BulkAddPermissions {...Publisher.args} />);
    const dspCheckbox = await screen.findByTestId('dsp');

    expect(dspCheckbox).toHaveAttribute('data-state', 'checked');
  });
  it('Renders "View Participants" button when there are checkboxes selected', () => {
    render(<BulkAddPermissions {...Publisher.args} />);
    expect(screen.getByRole('button', { name: 'View Participants' })).toBeInTheDocument();
  });
  it('Hides "View Participants" button when no checkboxes selected', async () => {
    const user = userEvent.setup();
    render(<BulkAddPermissions {...Publisher.args} />);
    const dspCheckbox = screen.getByTestId('dsp');

    // uncheck DSP
    await user.click(dspCheckbox);

    expect(screen.queryByRole('button', { name: 'View Participants' })).not.toBeInTheDocument();
  });
  it('Displays DSP participants when clicking "View Participants" as a Publisher', async () => {
    const user = userEvent.setup();
    render(<BulkAddPermissions {...Publisher.args} />);

    await user.click(screen.getByRole('button', { name: 'View Participants' }));
    const participantsTable = screen.getByRole('table');

    expect(within(participantsTable).getAllByText('DSP')[0]).toBeInTheDocument();
  });
  it('Shows warning when removing a shared type', async () => {
    const user = userEvent.setup();
    render(<BulkAddPermissions {...HasSharedWithPublisher.args} />);

    // Expand collapsible
    await user.click(screen.getByRole('button'));
    const publisherCheckbox = screen.getByTestId('publisher');

    // uncheck Publisher
    await user.click(publisherCheckbox);

    expect(
      screen.getByText(
        'If you remove the sharing permissions for a participant type, all sharing permissions of that type are removed, including future participants of that type.'
      )
    ).toBeInTheDocument();
  });
  it('Publisher checkbox is checked when participant has shared with Publisher', async () => {
    const user = userEvent.setup();
    render(<BulkAddPermissions {...HasSharedWithPublisher.args} />);

    // Expand collapsible
    await user.click(screen.getByRole('button'));
    const publisherCheckbox = screen.getByTestId('publisher');

    expect(publisherCheckbox).toHaveAttribute('data-state', 'checked');
  });
});
