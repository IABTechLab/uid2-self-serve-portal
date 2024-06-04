import { composeStories } from '@storybook/react';
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
    const [
      ,
      participant1Checkbox,
      participant2Checkbox,
      participant3Checkbox,
      participant4Checkbox,
    ] = screen.getAllByRole('checkbox');

    // The label text assumes that you are using the participant's name as the label for the checkbox.
    // If it's different, please update it accordingly.

    expect(participant1Checkbox).toHaveAttribute('data-state', 'checked');
    expect(participant2Checkbox).toHaveAttribute('data-state', 'unchecked');
    expect(participant3Checkbox).toHaveAttribute('data-state', 'checked');
    expect(participant4Checkbox).toHaveAttribute('data-state', 'unchecked');
  });
});
