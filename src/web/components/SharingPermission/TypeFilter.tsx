import clsx from 'clsx';

import { ClientType, ClientTypeDescriptions } from '../../../api/services/adminServiceHelpers';

import './TypeFilter.scss';

type TypeButtonProps = {
  type: ClientType;
  isSelected: boolean;
  onTypeSelect: (selectedTypeId: ClientType) => void;
};

export function TypeButton({ type, isSelected, onTypeSelect }: TypeButtonProps) {
  return (
    <button
      type='button'
      className={clsx('type-button', { selected: isSelected })}
      onClick={() => onTypeSelect(type)}
    >
      {ClientTypeDescriptions[type]}
    </button>
  );
}

type TypeFilterProps = {
  types: ClientType[];
  onFilterChange: (selectedTypeIds: Set<ClientType>) => void;
  selectedTypeIds: Set<ClientType>;
};

export function TypeFilter({ types, onFilterChange, selectedTypeIds }: TypeFilterProps) {
  const handleTypeSelect = (typeId: ClientType) => {
    const newSelectedTypeIds = new Set(selectedTypeIds);
    if (newSelectedTypeIds.has(typeId)) {
      newSelectedTypeIds.delete(typeId);
    } else {
      newSelectedTypeIds.add(typeId);
    }
    onFilterChange(newSelectedTypeIds);
    return newSelectedTypeIds;
  };

  return (
    <div className='type-filter'>
      {types.map((type) => (
        <TypeButton
          key={type}
          type={type}
          isSelected={selectedTypeIds.has(type)}
          onTypeSelect={handleTypeSelect}
        />
      ))}
    </div>
  );
}
