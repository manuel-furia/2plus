/**
 * Represents a key-value dictionary, where the keys are strings.
 */
export interface Dictionary<T> {
  [K: string]: T;
}
