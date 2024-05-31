import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import '../../styles/buttons.scss';

type ActionButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  icon: IconProp;
  iconClassName?: string;
};

function ActionButton(props: ActionButtonProps) {
  const { children, className, icon, iconClassName, onClick, ...buttonProps } = props;
  return (
    <button
      type='button'
      className={clsx('transparent-button', 'action-button', className)}
      onClick={onClick}
      {...buttonProps}
    >
      <FontAwesomeIcon icon={icon} className={iconClassName} />
      {children}
    </button>
  );
}

export default ActionButton;
