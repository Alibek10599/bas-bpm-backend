export type EntityChanges<T> = Partial<{
  [P in keyof T]: {
    old: T[P];
    new: T[P];
  };
}>;
