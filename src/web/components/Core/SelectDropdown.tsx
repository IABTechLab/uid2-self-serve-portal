import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

import './SelectDropdown.scss';

export type SelectOption<TValue> = {
  id: TValue;
  name: string;
};

type SelectDropdownProps<TValue> = Readonly<{
  title: string;
  options: SelectOption<TValue>[];
  onSelectedChange: (selected: SelectOption<TValue>) => void;
  containerClass?: string;
  className?: string;
  initialValue?: SelectOption<TValue>;
  // there are use cases where the selected item will be changed outside the dropdown, e.g. outside arrows
  // this is where updatedValue would be used
  updatedValue?: SelectOption<TValue>;
}>;

export function SelectDropdown<TValue>({
  title,
  options,
  onSelectedChange,
  containerClass,
  className,
  initialValue,
  updatedValue,
}: SelectDropdownProps<TValue>) {
  const [selectedItem, setSelectedItem] = useState<SelectOption<TValue>>();
  const [open, setOpen] = useState<boolean>(false);

  console.log('in select dropdown');
  console.log('new options', options);
  // console.log('selected item', selectedItem);

  const onOptionToggle = useCallback(
    (id: TValue) => {
      console.log('in on option toggle:', id);
      setSelectedItem(options.filter((option) => option.id === id)[0]);
      onSelectedChange(options.filter((option) => option.id === id)[0]);
      setOpen(false);
    },
    [onSelectedChange, options]
  );

  useEffect(() => {
    // console.log('initial value', initialValue);
    // console.log('selectedItem', selectedItem);
    if (initialValue && !selectedItem) {
      setSelectedItem(options.filter((option) => option.id === initialValue.id)[0]);
      console.log('in use effect');
      // console.log('in use effect select dropdown');
    } // else if (initialValue && JSON.stringify(initialValue) !== JSON.stringify(selectedItem)) {
    // onOptionToggle(initialValue.id);
    // }
  }, [initialValue]);

  useEffect(() => {
    console.log('in use effect updated value');
    if (updatedValue && JSON.stringify(updatedValue) !== JSON.stringify(selectedItem)) {
      setSelectedItem(options.filter((option) => option.id === updatedValue.id)[0]);
    }
  }, [updatedValue]);

  const checkboxItem = useCallback(
    (option: SelectOption<TValue>) => {
      console.log('in checkbox item');
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
    <div className={clsx('select-dropdown', containerClass)}>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger className={clsx(className, 'select-dropdown-trigger')}>
          {title}
          {title && ':'} {selectedItem?.name ?? initialValue?.name}
          {open ? <FontAwesomeIcon icon='chevron-up' /> : <FontAwesomeIcon icon='chevron-down' />}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className='select-dropdown-content' sideOffset={10} align='start'>
          {options.map(checkboxItem)}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
