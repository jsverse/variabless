import { readFileSync } from 'fs';

export function readFile(file: string): string {
  return readFileSync(file).toString();
}
