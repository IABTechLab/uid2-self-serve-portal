import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import '../../styles/buttons.scss';

type EditButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  iconClassName?: string;
};
function EditButton(props: EditButtonProps) {
  const { children, className, iconClassName, onClick, ...buttonProps } = props;
  return (
    <button
      type='button'
      className={clsx('transparent-button', className)}
      onClick={onClick}
      {...buttonProps}
    >
      <FontAwesomeIcon icon='pencil' className={iconClassName} />
      {children}
    </button>
  );
}
export default EditButton;
