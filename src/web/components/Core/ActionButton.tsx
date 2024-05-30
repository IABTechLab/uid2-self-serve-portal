import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import '../../styles/buttons.scss';

export enum ActionButtonIcon {
  edit = 'pencil',
  delete = 'trash-can'
};

type ActionButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  icon: ActionButtonIcon;
  iconClassName?: string;
};

function ActionButton(props: ActionButtonProps) {
  const { children, className, icon, iconClassName, onClick, ...buttonProps } = props;
  return (
    <button
      type='button'
      className={clsx('transparent-button', className)}
      onClick={onClick}
      {...buttonProps}
    >
      <FontAwesomeIcon icon={icon} className={iconClassName} />
      {children}
    </button>
  );
}

export default ActionButton;
