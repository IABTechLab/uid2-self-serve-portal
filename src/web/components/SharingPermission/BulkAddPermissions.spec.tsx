import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from '@testing-library/react';

import * as stories from './BulkAddPermissions.stories';

const { Publisher, HasSharedWithPublisher } = composeStories(stories);

describe('BulkAddPermissions', () => {
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
});
