import postcss, { Root } from 'postcss';

import { applyStyle } from './applyStyle';
import { defaultOptions, setConfig } from './config';
import { getVariablesConfig } from './getVariablesConfig';
import { Config } from './types';

// @ts-ignore
module.exports = postcss.plugin('postcss-js-to-vars', function jsToVars(userConfig: Partial<Config> = {}) {
  const config = { ...defaultOptions, ...userConfig };
  setConfig(config);
  const styles = getVariablesConfig(config.source);

  return function (root: Root) {
    if (!root.source.input.file.endsWith(config.target)) return;
    applyStyle(root, styles);
  };
});
