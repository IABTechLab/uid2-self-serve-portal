import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClientType } from '../../../api/services/adminServiceHelpers';
import * as stories from './TypeFilter.stories';

const { Default } = composeStories(stories);

describe('TypeFilter', () => {
  it('calls onFilterChange with correct type id when a type button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnFilterChange = jest.fn();

    render(<Default onFilterChange={mockOnFilterChange} />);

    const button = screen.getByText('DSP');
    await user.click(button);

    expect(mockOnFilterChange).toHaveBeenCalled();
    const firstCallArg = mockOnFilterChange.mock.calls[0][0] as Set<ClientType>;
    expect(firstCallArg.has('DSP')).toBeTruthy();
  });
});
