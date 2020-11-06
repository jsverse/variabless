import { resolve } from 'path';

import { readFile } from './helpers/readFile';
import { VariablesMapping } from './types';

const fileResolvers = {
  ts: tsResolver,
  js: jsResolver,
  json: jsonResolver
};

export function getVariablesConfig(source: string): VariablesMapping {
  const file = resolve(process.cwd(), source);
  const [, fileExtension] = file.match(/\.(.+)$/);
  const resolver = fileResolvers[fileExtension];

  return resolver(file);
}

function tsResolver(file): VariablesMapping {
  require('ts-node').register({
    compilerOptions: {
      module: 'commonjs',
      target: 'es5',
      lib: ['esnext', 'dom']
    }
  });

  return require(file);
}

function jsResolver(file): VariablesMapping {
  return require(file);
}

function jsonResolver(file): VariablesMapping {
  return JSON.parse(readFile(file));
}
