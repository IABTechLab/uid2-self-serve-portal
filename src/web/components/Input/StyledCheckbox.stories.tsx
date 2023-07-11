import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm, UseFormProps } from 'react-hook-form';

import { FormStyledCheckbox } from './StyledCheckbox';

export default {
  title: 'Inputs/StyledCheckbox',
  component: FormStyledCheckbox,
} as ComponentMeta<typeof FormStyledCheckbox>;

type FormData = {
  boxIsChecked: boolean;
};
const templateBuilder = (formProps?: UseFormProps<FormData>) => {
  const Template: ComponentStory<typeof FormStyledCheckbox> = (args) => {
    const { register, control, watch, handleSubmit } = useForm<FormData>(formProps);
    const value = watch('boxIsChecked');
    const onSubmit = (data: FormData) => {
      // eslint-disable-next-line no-console
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
  {}
);
DefaultTrueExample.args = {};

export const DefaultFalseExample = templateBuilder({ defaultValues: { boxIsChecked: false } }).bind(
  {}
);
DefaultFalseExample.args = { defaultValue: false };
