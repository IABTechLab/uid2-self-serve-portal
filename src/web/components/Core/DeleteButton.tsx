import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import '../../styles/buttons.scss';

type DeleteButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  containerClass?: string;
};
function DeleteButton(props: DeleteButtonProps) {
  const { className, containerClass, onClick, ...buttonProps } = props;
  return (
    <button
      type='button'
      className={clsx('transparent-button', className)}
      onClick={onClick}
      {...buttonProps}
    >
      <FontAwesomeIcon icon='trash-can' />
    </button>
  );
}
export default DeleteButton;
