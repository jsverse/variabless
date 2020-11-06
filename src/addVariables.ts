import { addClasses } from './addClasses';
import { getCache, setCache } from './cache';
import { createVariablesMap } from './helpers/createVariablesMap';
import { isEmpty } from './helpers/validators';
import { Delimiter } from './types';

export function addVariables({
  ast,
  map,
  selector = ':root',
  ruleConfig = [],
  cacheKey,
  delimiter = Delimiter.Kebab_Case
}) {
  const root = ast.append({ selector }).last;
  let cache = getCache(cacheKey);
  if (isEmpty(cache)) {
    const variablesMap = createVariablesMap(map, delimiter);
    const variablesKeys = Object.keys(variablesMap);
    cache = {
      variables: variablesKeys.map(key => ({ prop: `--${key}`, value: variablesMap[key] })),
      variablesKeys
    };
    setCache(cacheKey, cache);
  }
  for (const variable of cache.variables) {
    root.append(variable);
  }
  if (ruleConfig.length > 0) {
    addClasses(ast, cache.variablesKeys, ruleConfig);
  }
}
