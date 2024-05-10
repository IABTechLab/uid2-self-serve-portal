import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import '../../styles/buttons.scss';

type EditButtonProps = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  containerClass?: string;
};
function EditButton(props: EditButtonProps) {
  const { className, containerClass, onClick, ...buttonProps } = props;
  return (
    <button
      type='button'
      className={clsx('transparent-button', className)}
      onClick={onClick}
      {...buttonProps}
    >
      <FontAwesomeIcon icon='pencil' />
    </button>
  );
}
export default EditButton;
