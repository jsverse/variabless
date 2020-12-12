import { generateCSS } from './generateCSS';
import { coerceArray, last } from './helpers/array';
import { isString } from './helpers/validators';
import { resolveName } from './resolveName';
import { NameResolver, RulesMap, SelectorDefinition, TokensValueMap, VariableDefinition } from './types';
import { validateRule } from './validateRule';

export function buildVariables(rulesMap: RulesMap): string {
  const varContainers: Record<string, { selectors: SelectorDefinition[]; variables: VariableDefinition[] }> = {};

  for (const [ruleSetKey, rules] of Object.entries(rulesMap)) {
    for (const [ruleKey, rule] of Object.entries(rules)) {
      validateRule({ ...rule, ruleSetKey, ruleKey });

      const { variableName, value: ruleValue, appendVariablesTo = ':root', properties = [] } = rule;
      if (!varContainers[appendVariablesTo]) {
        varContainers[appendVariablesTo] = { selectors: [], variables: [] };
      }
      const current = varContainers[appendVariablesTo];

      const tokensMap: TokensValueMap = {};
      // Output spacing
      const raws = { before: '\n    ' };

      const curried = (resolver: string | NameResolver) => resolveName(resolver, tokensMap);

      const addVariable = value =>
        current.variables.push({
          prop: `--${curried(variableName)}`,
          value,
          raws
        });

      const addSelector = (prop: string, selector: string | NameResolver) =>
        current.selectors.push({
          selector: curried(selector),
          prop,
          value: `var(${last(current.variables).prop})`,
          raws
        });

      const applyRule = value => {
        addVariable(value);

        for (const { prop, selector } of properties) {
          for (const cssProp of coerceArray(prop)) {
            tokensMap.property = cssProp;
            addSelector(cssProp, selector);
          }
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

  return generateCSS(varContainers);
}
