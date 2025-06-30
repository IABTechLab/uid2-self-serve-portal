import { Meta, StoryObj } from '@storybook/react';
import { useForm, FormProvider, UseFormProps } from 'react-hook-form';
import { FormStyledCheckbox } from './StyledCheckbox';

type FormData = {
  boxIsChecked: boolean;
};

const CheckboxWithForm = ({
  formProps,
  ...checkboxArgs
}: {
  formProps?: UseFormProps<FormData>;
  [key: string]: any;
}) => {
  const methods = useForm<FormData>(formProps);
  const { control, watch, handleSubmit } = methods;
  const value = watch('boxIsChecked');
  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormStyledCheckbox<FormData, 'boxIsChecked'>
          name="boxIsChecked"
          control={control}
          {...checkboxArgs}
        />
        <button type="submit">Submit</button>
      </form>
      <div>Current checkbox value: {`${value}`}</div>
    </FormProvider>
  );
};

const meta: Meta<typeof CheckboxWithForm> = {
  title: 'Shared Components/Inputs/Styled Checkbox',
  component: CheckboxWithForm,
};

export default meta;

type Story = StoryObj<typeof CheckboxWithForm>;

export const BasicExample: Story = {
  args: {},
};

export const DefaultTrueExample: Story = {
  args: {
    formProps: {
      defaultValues: { boxIsChecked: true },
    },
  },
};

export const DefaultFalseExample: Story = {
  args: {
    formProps: {
      defaultValues: { boxIsChecked: false },
    },
  },
};
