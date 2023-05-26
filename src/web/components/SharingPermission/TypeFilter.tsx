import clsx from 'clsx';
import { useState } from 'react';
import { z } from 'zod';

import { ParticipantTypeSchema } from '../../../api/entities/ParticipantType';

import './TypeFilter.scss';

type TypeButtonProps = {
  type: z.infer<typeof ParticipantTypeSchema>;
  isSelected: boolean;
  onTypeSelect: (selectedTypeId: number) => void;
};

export function TypeButton({ type, isSelected, onTypeSelect }: TypeButtonProps) {
  return (
    <button
      type='button'
      className={clsx('type-button', { selected: isSelected })}
      onClick={() => onTypeSelect(type.id)}
    >
      {type.typeName}
    </button>
  );
}

type TypeFilterProps = {
  types: z.infer<typeof ParticipantTypeSchema>[];
  onFilterChange: (selectedTypeIds: Set<number>) => void;
};

export function TypeFilter({ types, onFilterChange }: TypeFilterProps) {
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<number>());

  const handleTypeSelect = (typeId: number) => {
    setSelectedTypeIds((prevState) => {
      const newSelectedTypeIds = new Set(prevState);
      if (newSelectedTypeIds.has(typeId)) {
        newSelectedTypeIds.delete(typeId);
      } else {
        newSelectedTypeIds.add(typeId);
      }
      onFilterChange(newSelectedTypeIds);
      return newSelectedTypeIds;
    });
  };

  return (
    <div className='type-filter'>
      {types.map((type) => (
        <TypeButton
          key={type.id}
          type={type}
          isSelected={selectedTypeIds.has(type.id)}
          onTypeSelect={handleTypeSelect}
        />
      ))}
    </div>
  );
}
