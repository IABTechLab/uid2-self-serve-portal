import { Meta, StoryFn } from '@storybook/react';
import { useForm, UseFormProps } from 'react-hook-form';

import { FormStyledCheckbox } from './StyledCheckbox';

export default {
  title: 'Shared Components/Inputs/Styled Checkbox',
  component: FormStyledCheckbox,
} as Meta<typeof FormStyledCheckbox>;

type FormData = {
  boxIsChecked: boolean;
};
const templateBuilder = (formProps?: UseFormProps<FormData>) => {
  const Template: StoryFn<typeof FormStyledCheckbox> = (args) => {
    const { register, control, watch, handleSubmit } = useForm<FormData>(formProps);
    const value = watch('boxIsChecked');
    const onSubmit = (data: FormData) => {
      console.log('Submitted', data);
      return false;
    };
    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FormStyledCheckbox<FormData, 'boxIsChecked'>
              {...args}
              {...register('boxIsChecked')}
              control={control}
            />
          </div>
          <button type='submit'>Submit</button>
        </form>
        <div>Current checkbox value: {`${value}`}</div>
      </>
    );
  };
  return Template;
};

export const BasicExample = templateBuilder().bind({});
BasicExample.args = {};

export const DefaultTrueExample = templateBuilder({ defaultValues: { boxIsChecked: true } }).bind(
  {},
);
DefaultTrueExample.args = {};

export const DefaultFalseExample = templateBuilder({ defaultValues: { boxIsChecked: false } }).bind(
  {},
);
DefaultFalseExample.args = { defaultValue: false };
