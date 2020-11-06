import Root from 'postcss/lib/root';

import { addVariables } from './addVariables';
import { isEmpty } from './helpers/validators';
import { VariableConfig } from './types';

export function handleThemeVariables(
  ast: Root,
  { selector = 'body', ruleConfig, delimiter, ...theme }: VariableConfig
) {
  for (const [paletteKey, palette] of Object.entries(theme)) {
    if (isEmpty(palette)) continue;

    addVariables({
      ast,
      map: palette,
      ruleConfig,
      delimiter,
      cacheKey: `${paletteKey}-palette`,
      selector: `${selector}.${paletteKey}-theme`
    });
  }
}
