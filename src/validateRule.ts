import { coerceArray } from './helpers/array';
import { isString, isTokenizedString } from './helpers/validators';
import { Rule } from './types';

interface options extends Rule {
  ruleKey: string;
  ruleSetKey: string;
}

function collisionMsg(prop: string, value: any) {
  return `Possible collision: expected '${prop}' to be a function or a tokenized string but got ${value}`;
}

export function validateRule({ ruleKey, ruleSetKey, variableName, value, properties }: options) {
  const missingMsg = (missing, rest = '') => `Missing ${missing} name for: ${ruleSetKey} -> ${ruleKey} ${rest}`;

  if (!variableName) {
    throw missingMsg('variable');
  }

  if (!isString(value)) {
    if (isString(variableName) && !isTokenizedString(variableName)) {
      throw collisionMsg('variableName', variableName);
    }
  }

  if (properties) {
    for (const { prop, selector } of coerceArray(properties)) {
      if (!selector) {
        throw missingMsg('selector', `-> ${prop}`);
      }

      if (!isString(value) || coerceArray(prop).length > 1) {
        if (isString(selector) && !isTokenizedString(selector)) {
          throw collisionMsg('selector', variableName);
        }
      }
    }
  }
}
