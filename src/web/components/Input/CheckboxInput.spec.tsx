import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Form } from '../Core/Form';
import { CheckboxInput } from './CheckboxInput';
import * as stories from './CheckboxInput.stories';

const { WithValidation, OneOption } = composeStories(stories);

describe('CheckboxInput', () => {
  it('should work with one option', async () => {
    const onSubmitMock = jest.fn(() => {});

    render(
      <Form onSubmit={onSubmitMock}>
        <CheckboxInput
          inputName='default'
          label='Select options'
          options={[{ optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' }]}
        />
      </Form>
    );

    userEvent.click(screen.getByRole('checkbox', { name: 'Option 1' }));

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmitMock.mock.calls).toEqual([[{ default: ['option1'] }]]);
    });
  });

  it('should work with mutltiple option', async () => {
    const onSubmitMock = jest.fn(() => {});

    render(
      <Form onSubmit={onSubmitMock}>
        <CheckboxInput
          inputName='default'
          label='Select options'
          options={[
            { optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' },
            { optionLabel: 'Option 2', optionToolTip: 'Option2', value: 'option2' },
            { optionLabel: 'Option 3', optionToolTip: 'Option3', value: 'option3' },
          ]}
        />
      </Form>
    );

    userEvent.click(screen.getByRole('checkbox', { name: 'Option 1' }));
    userEvent.click(screen.getByRole('checkbox', { name: 'Option 2' }));

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmitMock.mock.calls).toEqual([[{ default: ['option1', 'option2'] }]]);
    });
  });

  it('should work with no option selected', async () => {
    const onSubmitMock = jest.fn(() => {});

    render(
      <Form onSubmit={onSubmitMock}>
        <CheckboxInput
          inputName='default'
          label='Select options'
          options={[
            { optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' },
            { optionLabel: 'Option 2', optionToolTip: 'Option2', value: 'option2' },
            { optionLabel: 'Option 3', optionToolTip: 'Option3', value: 'option3' },
          ]}
        />
      </Form>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmitMock.mock.calls).toEqual([[{ default: [] }]]);
    });
  });

  it('should show default values as selected', async () => {
    const onSubmitMock = jest.fn(() => {});

    render(
      <Form onSubmit={onSubmitMock} defaultValues={{ default: ['option1', 'option2'] }}>
        <CheckboxInput
          inputName='default'
          label='Select options'
          options={[
            { optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' },
            { optionLabel: 'Option 2', optionToolTip: 'Option2', value: 'option2' },
            { optionLabel: 'Option 3', optionToolTip: 'Option3', value: 'option3' },
          ]}
        />
      </Form>
    );

    await waitFor(() => {
      const option1 = screen.getByRole('checkbox', { name: 'Option 1' });
      expect(option1).toBeChecked();
    });

    await waitFor(() => {
      const option2 = screen.getByRole('checkbox', { name: 'Option 2' });
      expect(option2).toBeChecked();
    });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmitMock.mock.calls).toEqual([[{ default: ['option1', 'option2'] }]]);
    });
  });

  it('verifies field based on rule', async () => {
    render(<WithValidation />);

    userEvent.click(screen.getByRole('checkbox', { name: 'Option 2' }));
    await waitFor(() => {
      const option2 = screen.getByLabelText('Option 2');
      expect(option2).toBeChecked();
    });
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('At least two options are required');

    userEvent.click(screen.getByRole('checkbox', { name: 'Option 3' }));
    await waitForElementToBeRemoved(screen.queryByRole('alert'));
  });
});
