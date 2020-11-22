import { Root } from 'postcss';
import Rule from 'postcss/lib/rule';

import { SelectorDefinition, VariableDefinition } from './types';

export function generateCSS(
  containers: Record<string, { selectors: SelectorDefinition[]; variables: VariableDefinition[] }>
) {
  const root = new Root();
  for (const [key, { variables, selectors }] of Object.entries(containers)) {
    const rule = new Rule({ selector: key });

    for (const variable of variables) {
      rule.append(variable);
    }

    root.append(rule);

    for (const { selector, ...node } of selectors) {
      const selectorRule = new Rule({ selector }).append(node);
      root.append(selectorRule);
    }
  }

  return root.toString();
}
