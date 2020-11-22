import { isString } from './helpers/validators';
import { TOKENS, TokensValueMap } from './types';

export function resolveName(resolver: string | Function, tokenValues: TokensValueMap = {}) {
  let resolved: string;
  if (isString(resolver)) {
    const tokensRegex = new RegExp(`:(${TOKENS.join('|')})`, 'g');
    resolved = resolver.replace(tokensRegex, (_, token) => tokenValues[token]);
  } else {
    resolved = resolver(tokenValues);
  }

  return resolved;
}
