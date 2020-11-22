import { TOKENS } from '../types';

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isTokenizedString(str: string): boolean {
  return TOKENS.some(token => str.includes(`:${token}`));
}
