export function isEmpty(obj: Object): boolean {
  return !obj || Object.keys(obj).length === 0;
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNil(value: any): value is null | undefined {
  return value === null || value === undefined;
}
