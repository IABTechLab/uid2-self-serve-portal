import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import * as stories from './Form.stories';

jest.mock('axios');
const mockOnSubmit = jest.fn();

const { WithInputFields, SubmitWithError, WithDefaultData, WithSubmitButtonText } =
  composeStories(stories);

describe('Form Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should load inputs and able to get formData from it', async () => {
    const user = userEvent.setup();
    render(<WithInputFields onSubmit={mockOnSubmit} />);

    const textInput = screen.getByTestId('text-input');

    await user.type(textInput, 'New value');
    await waitFor(() => {
      expect(screen.getByDisplayValue('New value')).toBeInTheDocument();
    });

    const radio2 = screen.getByLabelText('No');
    await user.click(radio2);
    await waitFor(() => {
      expect(radio2).toBeChecked();
    });

    const checkbox1 = screen.getByRole('checkbox', { name: 'Checkbox 1' });
    await user.click(checkbox1);
    await waitFor(() => {
      expect(checkbox1).toBeChecked();
    });

    await user.click(screen.getByRole('combobox', { name: 'selectInputValue' }));

    await waitFor(async () => {
      const option = screen.getByRole('option', { name: 'Option 2' });
      expect(option).toBeInTheDocument();
    });
    await user.click(screen.getByRole('option', { name: 'Option 2' }));

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    const expectFormData = {
      checkboxInputValue: ['1'],
      radioInputValue: 0,
      selectInputValue: '2',
      textInput: 'New value',
    };
    await waitFor(async () => {
      expect(mockOnSubmit).toBeCalledWith(expectFormData);
    });
  });

  test('should render form with given button text', async () => {
    render(<WithSubmitButtonText />);
    const button = await screen.findByRole('button');
    expect(button).toHaveTextContent('Create');
  });

  test('should render input with default value', async () => {
    const user = userEvent.setup();
    const defaultFormData = {
      checkboxInputValue: ['1', '2'],
      radioInputValue: 0,
      selectInputValue: '1',
      textInput: 'Some default value',
    };
    render(<WithDefaultData onSubmit={mockOnSubmit} defaultValues={defaultFormData} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Some default value')).toBeInTheDocument();
    });

    const radio2 = screen.getByLabelText('No');
    await waitFor(() => {
      expect(radio2).toBeChecked();
    });

    const checkbox1 = screen.getByRole('checkbox', { name: 'Checkbox 1' });
    await waitFor(() => {
      expect(checkbox1).toBeChecked();
    });

    const checkbox2 = screen.getByRole('checkbox', { name: 'Checkbox 2' });
    await waitFor(() => {
      expect(checkbox2).toBeChecked();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(async () => {
      expect(mockOnSubmit).toBeCalledWith(defaultFormData);
    });
  });

  test('should render error with user click submit', async () => {
    const user = userEvent.setup();
    render(<SubmitWithError />);
    const button = await screen.findByRole('button');
    await user.click(button);
    const formError = await screen.findByTestId('formError');
    expect(formError).toHaveTextContent('Something went wrong, please try again');
  });

  test('should render a server error when axios error occurs', async () => {
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);
    const serverErrorMessage = 'Server error message';

    mockOnSubmit.mockImplementation(() => {
      const errorMessage = {
        response: {
          data: [{ message: serverErrorMessage }],
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw errorMessage;
    });

    const user = userEvent.setup();
    render(<WithDefaultData onSubmit={mockOnSubmit} />);
    const button = await screen.findByRole('button');
    await user.click(button);
    const formError = await screen.findByTestId('formError');
    expect(formError).toHaveTextContent(serverErrorMessage);
  });

  test('should render an error when unknown server error occurs', async () => {
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    mockOnSubmit.mockImplementation(() => {
      const error = {
        response: {},
      };

      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error;
    });

    const user = userEvent.setup();
    render(<WithDefaultData onSubmit={mockOnSubmit} />);
    const button = await screen.findByRole('button');
    await user.click(button);
    const formError = await screen.findByTestId('formError');
    expect(formError).toHaveTextContent('Something went wrong, please try again');
  });
});
