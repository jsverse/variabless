import { writeFileSync } from 'fs';

import { generateCSS } from './generateCSS';
import { getRules } from './getRules';
import { coerceArray, last } from './helpers/array';
import { isString } from './helpers/validators';
import { resolveName } from './resolveName';
import { Config, SelectorDefinition, TokensValueMap, VariableDefinition } from './types';
import { validateRule } from './validateRule';

export function applyVariableRules(config: Config) {
  const ruleSets = getRules(config.srcPath);
  const varContainers: Record<string, { selectors: SelectorDefinition[]; variables: VariableDefinition[] }> = {};

  for (const [ruleSetKey, rules] of Object.entries(ruleSets)) {
    for (const [ruleKey, rule] of Object.entries(rules)) {
      validateRule({ ...rule, ruleSetKey, ruleKey });

      const { variableName, value: ruleValue, appendVariablesTo = ':root', property, selector } = rule;
      if (!varContainers[appendVariablesTo]) {
        varContainers[appendVariablesTo] = { selectors: [], variables: [] };
      }
      const current = varContainers[appendVariablesTo];

      const tokensMap: TokensValueMap = {};
      const curried = resolver => resolveName(resolver, tokensMap);
      const addVariable = value =>
        current.variables.push({
          prop: `--${curried(variableName)}`,
          value
        });
      const addSelector = prop =>
        current.selectors.push({
          selector: curried(selector),
          prop,
          value: `var(${last(current.variables).prop});`
        });
      const applyRule = value => {
        if (property) {
          for (const cssProp of coerceArray(property)) {
            tokensMap.property = cssProp;
            addVariable(value);
            addSelector(cssProp);
          }
        } else {
          addVariable(value);
        }
      };

      if (isString(ruleValue)) {
        applyRule(ruleValue);
      } else {
        for (const [valueKey, currentValue] of Object.entries(ruleValue)) {
          tokensMap.valueKey = valueKey;
          applyRule(currentValue);
        }
      }
    }
  }
  const css = generateCSS(varContainers);
  writeFileSync(config.outputPath, css);
}
