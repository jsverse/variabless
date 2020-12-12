import chalk from 'chalk';

import { coerceArray } from './helpers/array';
import { isString, isTokenizedString } from './helpers/validators';
import { Rule } from './types';

interface options extends Rule {
  ruleKey: string;
  ruleSetKey: string;
}

function logError(msg, path) {
  console.error(chalk.red('\nError!'), `${msg}, see:`);
  console.error(path, '\n');
  process.exit(1);
}

export function validateRule({ ruleKey, ruleSetKey, variableName, value, properties }: options) {
  const rulePath = [ruleSetKey, ruleKey];
  const createPath = (path: string | string[] = []) => rulePath.concat(coerceArray(path)).join(' -> ');
  const missingMsg = (missing, path: string[] = [missing]) => logError(`missing '${missing}'`, createPath(path));
  const collisionMsg = (prop: string, path: string[] = [prop]) =>
    logError(`expected '${prop}' to be a function or a tokenized string`, createPath(path));

  if (!variableName) {
    missingMsg('variable');
  }

  if (!isString(value)) {
    if (isString(variableName) && !isTokenizedString(variableName)) {
      collisionMsg('variableName');
    }
  }

  if (properties) {
    if (!Array.isArray(properties)) {
      logError(`expected 'properties' to be an array`, createPath('properties'));
    }

    for (let i = 0; i < properties.length; i++) {
      let { prop, selector } = properties[i];
      let validationTarget = 'prop';
      const path = () => [`properties[${i}]`, validationTarget];

      if (!prop) {
        missingMsg('prop', path());
      }

      validationTarget = 'selector';

      if (!selector) {
        missingMsg('selector', path());
      }

      if (!isString(value) || coerceArray(prop).length > 1) {
        if (isString(selector) && !isTokenizedString(selector)) {
          collisionMsg('selector', path());
        }
      }
    }
  }
}
