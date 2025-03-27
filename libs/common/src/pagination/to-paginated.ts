import { PaginatedList } from './types/paginated-list';

export const toPaginated = <TItem>(
  items: TItem[],
  count: number,
): PaginatedList<TItem> => {
  return {
    items: items,
    info: {
      count: count,
    },
  };
};
