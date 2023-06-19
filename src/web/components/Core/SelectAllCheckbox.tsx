import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';

import './SelectAllCheckbox.scss';

export const SelectAllCheckboxState = {
  checked: true,
  unchecked: false,
  indeterminate: 'indeterminate',
};

type SelectAllCheckboxProps = {
  status: Checkbox.CheckedState;
  onSelectAll: () => void;
  onUnselect: () => void;
  className?: string;
};

export function SelectAllCheckbox({
  status,
  onSelectAll,
  onUnselect,
  className,
}: SelectAllCheckboxProps) {
  const handleChange = () => {
    if (
      status === SelectAllCheckboxState.checked ||
      status === SelectAllCheckboxState.indeterminate
    ) {
      onUnselect();
    } else {
      onSelectAll();
    }
  };

  const getCheckboxIcon = () => {
    switch (status) {
      case SelectAllCheckboxState.checked:
        return <FontAwesomeIcon className='select-all-checkbox-icon' icon='check' />;
      case SelectAllCheckboxState.indeterminate:
        return <FontAwesomeIcon className='select-all-checkbox-icon' icon='minus' />;
      default:
        return null;
    }
  };
  return (
    <Checkbox.Root
      checked={status}
      onCheckedChange={handleChange}
      className={clsx('select-all-checkbox', className, {
        uncheck: status === SelectAllCheckboxState.unchecked,
      })}
    >
      <Checkbox.Indicator>{getCheckboxIcon()}</Checkbox.Indicator>
    </Checkbox.Root>
  );
}
