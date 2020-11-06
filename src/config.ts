import { Config } from './types';

export const defaultOptions: Config = {
  target: 'styles.scss',
  source: 'theme.ts'
};

let _config;

export function setConfig(config: Config) {
  _config = config;
}

export function getConfig(): Config {
  return _config;
}
