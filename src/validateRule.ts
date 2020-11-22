import { isString, isTokenizedString } from './helpers/validators';
import { Rule } from './types';

interface options extends Rule {
  ruleKey: string;
  ruleSetKey: string;
}
export function validateRule({ ruleKey, ruleSetKey, variableName, value, property, selector }: options) {
  if (!variableName) {
    throw `Missing variable name for: ${ruleSetKey} -> ${ruleKey}`;
  }
  if (property && !selector) {
    throw `You must provide a selector when using properties!`;
  }
  if (!isString(value) && property) {
    if (isString(variableName) && !isTokenizedString(variableName)) {
      throw `Variable name must be a function or a tokenized string!`;
    }
    if (isString(selector) && !isTokenizedString(selector)) {
      throw `Selector must be a function or a tokenized string!`;
    }
  }
}
