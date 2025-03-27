export class PaginatedList<TItem, TInfo = { count: number }> {
  items: TItem[];
  info: TInfo;
}
