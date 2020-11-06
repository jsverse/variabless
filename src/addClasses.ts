import { isNil } from './helpers/isNil';
import { VariableOptions } from './types';

export function addClasses(ast, classNames: string[], ruleConfig: VariableOptions['ruleConfig']) {
  for (const { rulePostfix, cssProp } of ruleConfig) {
    // => 'color'
    for (const name of classNames) {
      let selector = '.' + name.toLowerCase();
      selector += isNil(rulePostfix) ? `-${cssProp}` : rulePostfix ? `-${rulePostfix}` : '';
      ast.append({ selector }).last.append({ prop: cssProp, value: `var(--${name})` });
    }
  }
}
