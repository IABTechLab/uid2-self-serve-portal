import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { useCallback, useState } from 'react';

import './SelectDropdown.scss';

export type SelectOption<TValue> = {
  id: TValue;
  name: string;
};

type SelectDropdownProps<TValue> = Readonly<{
  title: string;
  options: SelectOption<TValue>[];
  onSelectedChange: (selected: SelectOption<TValue>) => void;
}>;

export function SelectDropdown<TValue>({
  title,
  options,
  onSelectedChange,
}: SelectDropdownProps<TValue>) {
  const [selectedItem, setSelectedItem] = useState<SelectOption<TValue>>();
  const [open, setOpen] = useState<boolean>(false);

  const onOptionToggle = useCallback(
    (id: TValue) => {
      setSelectedItem(options.filter((option) => option.id === id)[0]);
      onSelectedChange(options.filter((option) => option.id === id)[0]);
    },
    [onSelectedChange, selectedItem]
  );

  const checkboxItem = useCallback(
    (option: SelectOption<TValue>) => {
      const checked = selectedItem ? selectedItem.id === option.id : false;
      return (
        <DropdownMenu.CheckboxItem
          key={option.name}
          className='select-dropdown-checkbox-item'
          checked={checked}
          onCheckedChange={() => onOptionToggle(option.id)}
          onSelect={(e) => e.preventDefault()} // Prevent dropdown close
        >
          <button
            type='button'
            role='checkbox'
            aria-checked={checked}
            className={clsx({ uncheck: !checked })}
          >
            {checked && <FontAwesomeIcon icon='check' />}
          </button>
          {option.name}
        </DropdownMenu.CheckboxItem>
      );
    },
    [onOptionToggle, selectedItem]
  );

  return (
    <div className={clsx('select-dropdown', { active: !!selectedItem })}>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger className='select-dropdown-trigger'>
          {title}: {selectedItem?.name}
          {open ? <FontAwesomeIcon icon='chevron-up' /> : <FontAwesomeIcon icon='chevron-down' />}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className='select-dropdown-content' sideOffset={10} align='start'>
          {options.map(checkboxItem)}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
