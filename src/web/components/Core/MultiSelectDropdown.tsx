import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';

import { formatStringsWithSeparator } from '../../utils/textHelpers';

import './MultiSelectDropdown.scss';

type SelectOption<TValue> = {
  id: TValue;
  name: string;
};

type MultiSelectDropdownProps<TValue> = {
  title: string;
  options: SelectOption<TValue>[];
  onSelectedChange: (selected: Set<TValue>) => void;
};

export function MultiSelectDropdown<TValue>({
  title,
  options,
  onSelectedChange,
}: MultiSelectDropdownProps<TValue>) {
  const [selectedItems, setSelectedItems] = useState<Set<TValue>>(new Set());
  const [open, setOpen] = useState<boolean>(false);

  const joinedItemsName = useMemo(
    () =>
      formatStringsWithSeparator(
        options.filter((o) => selectedItems.has(o.id)).map((item) => item.name)
      ),
    [options, selectedItems]
  );

  const selectedItemsString =
    selectedItems.size && selectedItems.size < options.length ? joinedItemsName : 'All';

  const onOptionToggle = useCallback(
    (id: TValue) => {
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
    (option: SelectOption<TValue>) => {
      const checked = selectedItems.has(option.id);
      return (
        <DropdownMenu.CheckboxItem
          key={option.name}
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
    <div className={clsx('multi-select-dropdown', { active: !!selectedItems.size })}>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger className='multi-select-dropdown-trigger'>
          {title}: {selectedItemsString}
          {open ? <FontAwesomeIcon icon='chevron-up' /> : <FontAwesomeIcon icon='chevron-down' />}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className='multi-select-dropdown-content'
          sideOffset={10}
          align='start'
        >
          {options.map(checkboxItem)}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
