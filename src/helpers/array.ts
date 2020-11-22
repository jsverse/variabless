export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function last<T>(arr: T[]): T {
  return arr[arr.length - 1];
}
