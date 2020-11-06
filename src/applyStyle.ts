import { Root } from 'postcss';

import { addVariables } from './addVariables';
import { handleThemeVariables } from './handleThemeVariables';
import { isEmpty, isString } from './helpers/validators';
import { VariablesMapping, VariableConfig } from './types';

export function applyStyle(ast: Root, { theme, ...otherVars }: VariablesMapping) {
  theme && handleThemeVariables(ast, theme as VariableConfig);

  for (let [cacheKey, values] of Object.entries(otherVars)) {
    for (const [key, value] of Object.entries(values)) {
      cacheKey = `${cacheKey}-${key}`;
      const curried = (vars, config = {}) => addVariables({ ast, map: { [key]: vars }, cacheKey, ...config });
      if (isString(value)) {
        curried(value);
      } else {
        const { ruleConfig, selector, delimiter, ...vars } = value;
        if (!isEmpty(vars)) {
          curried(vars, { ruleConfig, selector, delimiter });
        }
      }
    }
  }
}
