import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClientType } from '../../../api/services/adminServiceHelpers';
import { TypeFilter } from './TypeFilter';
import * as stories from './TypeFilter.stories';

const { Default } = stories;

describe('TypeFilter', () => {
  it('calls onFilterChange with correct type id when a type button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnFilterChange = jest.fn();

    render(<TypeFilter {...Default.args} onFilterChange={mockOnFilterChange} />);

    const button = screen.getByText('DSP');
    await user.click(button);

    expect(mockOnFilterChange).toHaveBeenCalled();
    const firstCallArg = mockOnFilterChange.mock.calls[0][0] as Set<ClientType>;
    expect(firstCallArg.has('DSP')).toBeTruthy();
  });
});
