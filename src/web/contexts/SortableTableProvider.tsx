import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type SortFunction<TData> = (a: TData, b: TData) => number;

type SortableContextSetter<TData> = {
  sortKey: keyof TData | null;
  sortOrder: SortOrder;
  toggleSort: (key: keyof TData) => void;
  customSortFn?: ((a: TData, b: TData) => number) | null;
  setCustomSortFn: React.Dispatch<React.SetStateAction<SortFunction<TData> | null>>;
  sortData: (data: TData[]) => TData[];
};

export type SortOrder = 'desc' | 'asc' | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SortableContext = createContext<SortableContextSetter<any>>({
  sortKey: null,
  sortOrder: undefined,
  toggleSort: () => {
    // eslint-disable-next-line no-console
    console.error('SortableContext is not available');
  },
  customSortFn: null,
  setCustomSortFn: () => {
    // eslint-disable-next-line no-console
    console.error('SortableContext setCustomSortFn is not available');
  },
  sortData: () => {
    // eslint-disable-next-line no-console
    console.error('SortableContext sortData is not available');
    return [];
  },
});

export const useSortable = <TData extends {}>() => {
  return useContext<SortableContextSetter<TData>>(SortableContext);
};

export function SortableProvider<TData extends {}>({ children }: { children: ReactNode }) {
  const [sortKey, setSortKey] = useState<keyof TData | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(undefined);
  const [customSortFn, setCustomSortFn] = useState<SortFunction<TData> | null>(null);

  const toggleSort = useCallback(
    (key: keyof TData) => {
      if (sortKey === key) {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortOrder('asc');
      }
    },
    [sortKey]
  );

  const defaultSortFn = useCallback(
    (a: TData, b: TData): number => {
      if (!sortKey) return 0;

      const aSort =
        typeof a[sortKey] === 'string' ? (a[sortKey] as string).toLowerCase() : a[sortKey];
      const bSort =
        typeof b[sortKey] === 'string' ? (b[sortKey] as string).toLowerCase() : b[sortKey];

      if (aSort > bSort) return sortOrder === 'asc' ? 1 : -1;
      if (aSort < bSort) return sortOrder === 'asc' ? -1 : 1;

      return 0;
    },
    [sortKey, sortOrder]
  );

  const sortData = useCallback(
    (data: TData[]): TData[] => {
      const sortFn = customSortFn || defaultSortFn;
      return [...data].sort(sortFn); // Use spread to avoid mutating the original data
    },
    [customSortFn, defaultSortFn]
  );

  const sortableContext = useMemo(
    () => ({ sortKey, sortOrder, toggleSort, customSortFn, setCustomSortFn, sortData }),
    [sortKey, sortOrder, toggleSort, customSortFn, setCustomSortFn, sortData]
  );

  return (
    <SortableContext.Provider value={sortableContext as SortableContextSetter<TData>}>
      {children}
    </SortableContext.Provider>
  );
}
