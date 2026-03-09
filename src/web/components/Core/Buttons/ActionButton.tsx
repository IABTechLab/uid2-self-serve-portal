import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { forwardRef } from 'react';

type ActionButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  icon: IconProp;
  iconClassName?: string;
};

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>((props, ref) => {
  const { children, className, icon, iconClassName, onClick, ...buttonProps } = props;
  return (
    <button
      ref={ref}
      type='button'
      className={clsx('transparent-button', 'action-button', className)}
      onClick={onClick}
      {...buttonProps}
    >
      <FontAwesomeIcon icon={icon} className={iconClassName} />
      {children}
    </button>
  );
});

ActionButton.displayName = 'ActionButton';

export default ActionButton;
