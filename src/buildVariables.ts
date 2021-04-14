import { generateCSS } from './generateCSS';
import { coerceArray } from './helpers/array';
import { isString } from './helpers/validators';
import { resolveName } from './resolveName';
import { NameResolver, Rule, RulesMap, SelectorDefinition, TokensValueMap, VariableDefinition } from './types';
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

      const addVariable = (value: Rule['value']): VariableDefinition => {
        const variableDef = {
          prop: `--${curried(variableName)}`,
          value,
          raws
        };
        current.variables.push(variableDef);

        return variableDef;
      };

      const addSelector = (prop: string, selector: string | NameResolver, value: Rule['value']): void => {
        current.selectors.push({
          selector: curried(selector),
          prop,
          value,
          raws
        });
      };

      const applyRule = (value: Rule['value']) => {
        let variableDef: VariableDefinition;

        if (variableName) {
          variableDef = addVariable(value);
        }

        const resolvedValue = variableDef?.prop ? `var(${variableDef.prop})` : value;
        for (const { prop, selector } of properties) {
          for (const cssProp of coerceArray(prop)) {
            tokensMap.property = cssProp;
            addSelector(cssProp, selector, resolvedValue);
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
