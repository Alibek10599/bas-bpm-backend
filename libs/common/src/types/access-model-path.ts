import { AccessesModel } from './accesses-model';

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}${DotPrefix<Extract<P, string>>}`
    : never
  : never;

type LeafPaths<T> = {
  [K in keyof T]: T[K] extends boolean
    ? K
    : T[K] extends object
    ? Join<K, LeafPaths<T[K]>>
    : never;
}[keyof T];

export type AccessesModelPaths = LeafPaths<AccessesModel>;
