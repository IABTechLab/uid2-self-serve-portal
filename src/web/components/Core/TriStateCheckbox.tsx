import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';

import './TriStateCheckbox.scss';

export const TriStateCheckboxState = {
  checked: true,
  unchecked: false,
  indeterminate: 'indeterminate',
};

type TriStateCheckboxProps = {
  status: Checkbox.CheckedState;
  onClick: () => void;
  className?: string;
};

export function TriStateCheckbox({ status, onClick, className }: TriStateCheckboxProps) {
  const getCheckboxIcon = () => {
    switch (status) {
      case TriStateCheckboxState.checked:
        return <FontAwesomeIcon className='tristate-checkbox-icon' icon='check' />;
      case TriStateCheckboxState.indeterminate:
        return <FontAwesomeIcon className='tristate-checkbox-icon' icon='minus' />;
      default:
        return null;
    }
  };
  return (
    <div className='tristate-checkbox'>
      <Checkbox.Root
        checked={status}
        onCheckedChange={onClick}
        className={clsx(className, {
          uncheck: status === TriStateCheckboxState.unchecked,
        })}
      >
        <Checkbox.Indicator>{getCheckboxIcon()}</Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  );
}
