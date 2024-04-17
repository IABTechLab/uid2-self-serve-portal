import clsx from 'clsx';

import '../../styles/forms.scss';

type FormSubmitButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>;

function FormSubmitButton(props: FormSubmitButtonProps) {
  const { children, className, ...buttonProps } = props;
  return (
    <div className='form-footer'>
      <button type='submit' className={clsx('primary-button', className)} {...buttonProps}>
        {children ?? 'Submit'}
      </button>
    </div>
  );
}

export default FormSubmitButton;
