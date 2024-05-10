import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import '../../styles/buttons.scss';

type DeleteButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  iconClassName?: string;
};
function DeleteButton(props: DeleteButtonProps) {
  const { children, className, iconClassName, onClick, ...buttonProps } = props;
  return (
    <button
      type='button'
      className={clsx('transparent-button', className)}
      onClick={onClick}
      {...buttonProps}
    >
      <FontAwesomeIcon icon='trash-can' className={iconClassName} />
      {children}
    </button>
  );
}
export default DeleteButton;
