import { EntityChanges } from '@app/common';

const isEqual = (oldValue: any, newValue: any) => {
  if (typeof oldValue === 'object' || typeof newValue === 'object') {
    return JSON.stringify(oldValue) !== JSON.stringify(newValue);
  }
  return oldValue !== newValue;
};

export const getObjectChanges = <T>(
  oldEntity: T,
  update: Partial<T>,
): EntityChanges<T> => {
  const changes: EntityChanges<T> = {};
  for (const key in update) {
    if (isEqual(oldEntity[key], update[key])) {
      changes[key] = {
        old: oldEntity[key],
        new: update[key],
      };
    }
  }
  return changes;
};
