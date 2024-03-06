import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Form } from '../Core/Form';
import { MultiCheckboxInput } from './MultiCheckboxInput';
import * as stories from './MultiCheckboxInput.stories';
import { Option } from './SelectInput';

const { WithValidation } = composeStories(stories);

const checkBoxOptionsList = [
  [[{ optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' }]],
  [
    [
      { optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' },
      { optionLabel: 'Option 2', optionToolTip: 'Option2', value: 'option2' },
      { optionLabel: 'Option 3', optionToolTip: 'Option3', value: 'option3' },
    ],
  ],
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadComponent(options: Option<any>[]): jest.Mock<void, [], any> {
  const onSubmitMock = jest.fn(() => {});

  render(
    <Form onSubmit={onSubmitMock}>
      <MultiCheckboxInput inputName='default' label='Select options' options={options} />
    </Form>
  );

  return onSubmitMock;
}

describe('CheckboxInput', () => {
  it.each(checkBoxOptionsList)('Should show all options', (checkboxOptions) => {
    loadComponent(checkboxOptions);

    for (const checkboxOption of checkboxOptions) {
      expect(
        screen.getByRole('checkbox', { name: checkboxOption.optionLabel })
      ).toBeInTheDocument();
    }
  });

  it.each(checkBoxOptionsList)(
    'Should submit correctly when one option selected',
    async (checkboxOptions) => {
      const onSubmitMock = loadComponent(checkboxOptions);

      await userEvent.click(screen.getByRole('checkbox', { name: checkboxOptions[0].optionLabel }));

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      expect(onSubmitMock).toHaveBeenLastCalledWith({ default: [checkboxOptions[0].value] });
    }
  );

  it.each(checkBoxOptionsList)(
    'Should submit correctly when all options are selected',
    async (checkboxOptions) => {
      const onSubmitMock = loadComponent(checkboxOptions);

      checkboxOptions.map(async (checkboxOption) => {
        await userEvent.click(screen.getByRole('checkbox', { name: checkboxOption.optionLabel }));
      });

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      expect(onSubmitMock).toHaveBeenLastCalledWith({
        default: checkboxOptions.map((checkboxOption) => checkboxOption.value),
      });
    }
  );

  it.each(checkBoxOptionsList)(
    'Should submit correctly when no options are selected',
    async (checkboxOptions) => {
      const onSubmitMock = loadComponent(checkboxOptions);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      expect(onSubmitMock).toHaveBeenLastCalledWith({
        default: [],
      });
    }
  );

  it('should show default values as selected if given', async () => {
    const onSubmitMock = jest.fn(() => {});

    render(
      <Form onSubmit={onSubmitMock} defaultValues={{ default: ['option1', 'option2'] }}>
        <MultiCheckboxInput
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

    const option1 = screen.getByRole('checkbox', { name: 'Option 1' });
    expect(option1).toBeChecked();

    const option2 = screen.getByRole('checkbox', { name: 'Option 2' });
    expect(option2).toBeChecked();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenLastCalledWith({ default: ['option1', 'option2'] });
  });

  it('Verifies field based on rule', async () => {
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
