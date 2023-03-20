/* eslint-disable testing-library/no-unnecessary-act */
import { composeStories } from '@storybook/testing-react';
import { act, render, screen, waitFor } from '@testing-library/react';
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
    userEvent.setup();
    render(<WithInputFields onSubmit={mockOnSubmit} />);

    const textInput = screen.getByTestId('text-input');

    await act(async () => {
      await userEvent.type(textInput, 'New value');
      await userEvent.click(screen.getByRole('radio', { name: 'No' }));
      await userEvent.click(screen.getByRole('checkbox', { name: 'Checkbox 1' }));
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('New value')).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(screen.getByRole('combobox', { name: 'selectInputValue' }));
    });

    await waitFor(async () => {
      await userEvent.click(screen.getByRole('option', { name: 'Option 2' }));
    });

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

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
    userEvent.setup();
    const defaultFormData = {
      checkboxInputValue: ['1', '2'],
      radioInputValue: 0,
      selectInputValue: '1',
      textInput: 'Some default value',
    };
    render(<WithDefaultData onSubmit={mockOnSubmit} defaultValues={defaultFormData} />);
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    await waitFor(async () => {
      expect(mockOnSubmit).toBeCalledWith(defaultFormData);
    });
  });

  test('should render error with user click submit', async () => {
    userEvent.setup();

    render(<SubmitWithError />);
    const button = await screen.findByRole('button');
    userEvent.click(button);
    const formError = await screen.findByTestId('form-error');
    expect(formError).toHaveTextContent('Something went wrong, please try again');
  });

  test('should render a server error when axios error occurs', async () => {
    userEvent.setup();
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

    render(<WithDefaultData onSubmit={mockOnSubmit} />);
    const button = await screen.findByRole('button');
    userEvent.click(button);
    const formError = await screen.findByTestId('form-error');
    expect(formError).toHaveTextContent(serverErrorMessage);
  });

  test('should render an error when unknow server error occurs', async () => {
    userEvent.setup();
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    mockOnSubmit.mockImplementation(() => {
      const error = {
        response: {},
      };

      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error;
    });

    render(<WithDefaultData onSubmit={mockOnSubmit} />);
    const button = await screen.findByRole('button');
    userEvent.click(button);
    const formError = await screen.findByTestId('form-error');
    expect(formError).toHaveTextContent('Something went wrong, please try again');
  });
});
