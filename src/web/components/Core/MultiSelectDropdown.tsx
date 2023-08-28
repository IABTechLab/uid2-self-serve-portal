import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { useCallback, useState } from 'react';

import './MultiSelectDropdown.scss';

type SelectOption = {
  id: number;
  name: string;
};

type MultiSelectDropdownProps = {
  title: string;
  options: SelectOption[];
  onSelectedChange: (selected: Set<number>) => void;
};

export function MultiSelectDropdown({
  title,
  options,
  onSelectedChange,
}: MultiSelectDropdownProps) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState<boolean>(false);

  const selectedCount =
    selectedItems.size && selectedItems.size < options.length ? selectedItems.size : 'All';

  const onOptionToggle = useCallback(
    (id: number) => {
      const newCheckedItems = new Set(selectedItems);
      if (newCheckedItems.has(id)) {
        newCheckedItems.delete(id);
      } else {
        newCheckedItems.add(id);
      }

      setSelectedItems(newCheckedItems);
      onSelectedChange(newCheckedItems);
    },
    [onSelectedChange, selectedItems]
  );

  const checkboxItem = useCallback(
    (option: SelectOption) => {
      const checked = selectedItems.has(option.id);
      return (
        <DropdownMenu.CheckboxItem
          className='multi-select-dropdown-checkbox-item'
          checked={selectedItems.has(option.id)}
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
    [onOptionToggle, selectedItems]
  );

  return (
    <div className='multi-select-dropdown'>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger className='multi-select-dropdown-trigger'>
          {title}: {selectedCount}
          {open ? <FontAwesomeIcon icon='chevron-up' /> : <FontAwesomeIcon icon='chevron-down' />}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className='multi-select-dropdown-content' sideOffset={10}>
          {options.map(checkboxItem)}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
