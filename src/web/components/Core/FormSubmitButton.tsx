import '../../styles/forms.scss';

type FormSubmitButtonProps = Readonly<{
  buttonText?: string;
}>;

function FormSubmitButton({ buttonText = 'Submit' }: FormSubmitButtonProps) {
  return (
    <div className='form-footer'>
      <button type='submit' className='primary-button'>
        {buttonText}
      </button>
    </div>
  );
}

export default FormSubmitButton;
