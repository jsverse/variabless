import { resolve } from 'path';

import { readFile } from './helpers/readFile';
import { RulesMap } from './types';

let tsNodeInitiated = false;
const fileResolvers = {
  ts: tsResolver,
  js: jsResolver,
  json: jsonResolver
};

export function getRules(source: string): RulesMap {
  const file = resolve(process.cwd(), source);
  const [, fileExtension] = file.match(/\.(.+)$/);
  const resolver = fileResolvers[fileExtension];

  return resolver(file);
}

function tsResolver(file): RulesMap {
  if (!tsNodeInitiated) {
    require('ts-node').register({
      compilerOptions: {
        module: 'commonjs',
        target: 'es5',
        lib: ['esnext', 'dom']
      }
    });
    tsNodeInitiated = true;
  }

  return jsResolver(file);
}

function jsResolver(file): RulesMap {
  delete require.cache[file];

  return require(file);
}

function jsonResolver(file): RulesMap {
  return { rules: JSON.parse(readFile(file)) };
}
