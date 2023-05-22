import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from '@testing-library/react';

import * as stories from './ParticipantSearchBar.stories';

const { SearchBar } = composeStories(stories);

describe('ParticipantSearchBar', () => {
  it('should only show participant list when search bar is clicked', () => {
    render(<SearchBar />);

    expect(screen.queryByTestId('participant-table')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('textbox'));

    expect(screen.getByTestId('participant-table')).toBeInTheDocument();
  });

  it('should mark defaultSelected participants as checked', () => {
    render(<SearchBar />);
    fireEvent.click(screen.getByRole('textbox'));

    const participant1Checkbox = screen.getByLabelText('Participant 1');
    const participant2Checkbox = screen.getByLabelText('Participant 2');
    const participant3Checkbox = screen.getByLabelText('Participant 3');
    const participant4Checkbox = screen.getByLabelText('Participant 4');

    // The label text assumes that you are using the participant's name as the label for the checkbox.
    // If it's different, please update it accordingly.
    expect(participant1Checkbox).toBeChecked();
    expect(participant2Checkbox).not.toBeChecked();
    expect(participant3Checkbox).toBeChecked();
    expect(participant4Checkbox).not.toBeChecked();
  });
});
