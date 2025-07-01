/* eslint-disable */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';

import { MultiCheckboxInput } from './MultiCheckboxInput';
import { Option } from './SelectInput';
import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { CreateStory } from '../../../testHelpers/storybookHelpers';
import { WithValidation } from './MultiCheckboxInput.stories';

const WithValidationStory = CreateStory(WithValidation);

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

type TestComponentMultiCheckboxInputProps = Readonly<{
  options: Option<any>[];
  onSubmitMock: jest.Mock<void, [], any>;
  defaultOptions: string[];
}>;

function TestComponentMultiCheckboxInput({
  options,
  onSubmitMock,
  defaultOptions,
}: TestComponentMultiCheckboxInputProps) {
  const formMethods = useForm({
    defaultValues: {
      checkboxInput: defaultOptions,
    },
  });
  const { handleSubmit } = formMethods;
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmitMock)}>
        <MultiCheckboxInput inputName='checkboxInput' label='Select options' options={options} />
        <FormSubmitButton />
      </form>
    </FormProvider>
  );
}

function LoadComponent(options: Option<any>[]): jest.Mock<void, [], any> {
  const onSubmitMock = jest.fn(() => {});

  render(
    <TestComponentMultiCheckboxInput
      options={options}
      onSubmitMock={onSubmitMock}
      defaultOptions={[]}
    />
  );

  return onSubmitMock;
}

describe('CheckboxInput', () => {
  it.each(checkBoxOptionsList)('Should show all options', (checkboxOptions) => {
    LoadComponent(checkboxOptions);

    for (const checkboxOption of checkboxOptions) {
      expect(
        screen.getByRole('checkbox', { name: checkboxOption.optionLabel })
      ).toBeInTheDocument();
    }
  });

  it.each(checkBoxOptionsList)(
    'Should submit correctly when one option selected',
    async (checkboxOptions) => {
      const user = userEvent.setup();
      const onSubmitMock = LoadComponent(checkboxOptions);

      await user.click(screen.getByRole('checkbox', { name: checkboxOptions[0].optionLabel }));

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      expect(onSubmitMock).toHaveBeenLastCalledWith(
        { checkboxInput: [checkboxOptions[0].value] },
        expect.anything()
      );
    }
  );

  it.each(checkBoxOptionsList)(
    'Should submit correctly when all options are selected',
    async (checkboxOptions) => {
      const user = userEvent.setup();
      const onSubmitMock = LoadComponent(checkboxOptions);

      checkboxOptions.map(async (checkboxOption) => {
        await user.click(screen.getByRole('checkbox', { name: checkboxOption.optionLabel }));
      });

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      expect(onSubmitMock).toHaveBeenLastCalledWith(
        {
          checkboxInput: checkboxOptions.map((checkboxOption) => checkboxOption.value),
        },
        expect.anything()
      );
    }
  );

  it.each(checkBoxOptionsList)(
    'Should submit correctly when no options are selected',
    async (checkboxOptions) => {
      const user = userEvent.setup();
      const onSubmitMock = LoadComponent(checkboxOptions);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      expect(onSubmitMock).toHaveBeenLastCalledWith(
        {
          checkboxInput: [],
        },
        expect.anything()
      );
    }
  );

  it('should show default values as selected if given', async () => {
    const onSubmitMock = jest.fn(() => {});
    const user = userEvent.setup();

    const defaultOptions = ['option1', 'option2'];

    const options = [
      { optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' },
      { optionLabel: 'Option 2', optionToolTip: 'Option2', value: 'option2' },
      { optionLabel: 'Option 3', optionToolTip: 'Option3', value: 'option3' },
    ];

    render(
      <TestComponentMultiCheckboxInput
        options={options}
        onSubmitMock={onSubmitMock}
        defaultOptions={defaultOptions}
      />
    );

    const option1 = screen.getByRole('checkbox', { name: 'Option 1' });
    expect(option1).toBeChecked();

    const option2 = screen.getByRole('checkbox', { name: 'Option 2' });
    expect(option2).toBeChecked();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(onSubmitMock).toHaveBeenLastCalledWith(
      { checkboxInput: ['option1', 'option2'] },
      expect.anything()
    );
  });

  it('Verifies field based on rule', async () => {
    const user = userEvent.setup();
    render(<WithValidationStory />);

    await user.click(screen.getByRole('checkbox', { name: 'Option 2' }));
    await waitFor(() => {
      const option2 = screen.getByLabelText('Option 2');
      expect(option2).toBeChecked();
    });
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('At least two options are required');

    await user.click(screen.getByRole('checkbox', { name: 'Option 3' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
