import { flatten } from 'flat';

import { Delimiter } from '../types';

const delimiterMapping = {
  [Delimiter.Kebab_Case]: '-',
  [Delimiter.Snake_Case]: '_',
  [Delimiter.None]: ''
};

export function createVariablesMap(map: Record<string, any>, delimiter: Delimiter): Record<string, string> {
  return Object.entries(flatten(map)).reduce((acc, [key, value]) => {
    acc[key.replace(/\./g, delimiterMapping[delimiter])] = `${value}`;

    return acc;
  }, {});
}
