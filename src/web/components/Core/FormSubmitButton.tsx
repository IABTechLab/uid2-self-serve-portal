import clsx from 'clsx';

import '../../styles/forms.scss';

type FormSubmitButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  containerClass?: string;
};

function FormSubmitButton(props: FormSubmitButtonProps) {
  const { children, className, containerClass, ...buttonProps } = props;
  return (
    <div className={clsx('form-footer', className)}>
      <button type='submit' className={clsx('primary-button', className)} {...buttonProps}>
        {children ?? 'Submit'}
      </button>
    </div>
  );
}

export default FormSubmitButton;
