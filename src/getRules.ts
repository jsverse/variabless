import { resolve } from 'path';

import { readFile } from './helpers/readFile';
import { Rule } from './types';

const fileResolvers = {
  ts: tsResolver,
  js: jsResolver,
  json: jsonResolver
};

type RulesMap = Record<string, Record<string, Rule>>;

export function getRules(source: string): RulesMap {
  const file = resolve(process.cwd(), source);
  const [, fileExtension] = file.match(/\.(.+)$/);
  const resolver = fileResolvers[fileExtension];

  return resolver(file);
}

function tsResolver(file): RulesMap {
  require('ts-node').register({
    compilerOptions: {
      module: 'commonjs',
      target: 'es5',
      lib: ['esnext', 'dom']
    }
  });

  return require(file);
}

function jsResolver(file): RulesMap {
  return require(file);
}

function jsonResolver(file): RulesMap {
  return { rules: JSON.parse(readFile(file)) };
}
