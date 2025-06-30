import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBarStory } from './ParticipantSearchBar.stories';

describe('ParticipantSearchBar', () => {
  it('should only show participant list when search bar is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBarStory />);

    expect(screen.queryByTestId('participant-table')).not.toBeInTheDocument();

    await user.click(screen.getByRole('textbox'));

    expect(screen.getByTestId('participant-table')).toBeInTheDocument();
  });

  it('should mark defaultSelected participants as checked', async () => {
    const user = userEvent.setup();
    render(<SearchBarStory />);
    await user.click(screen.getByRole('textbox'));
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
