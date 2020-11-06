import { Root } from 'postcss';

import { applyStyle } from './applyStyle';
import { defaultOptions, setConfig } from './config';
import { getVariablesConfig } from './getVariablesConfig';
import { Config } from './types';

module.exports = function jsToVars(userConfig: Partial<Config> = {}) {
  const config = { ...defaultOptions, ...userConfig };
  setConfig(config);
  const styles = getVariablesConfig(config.source);

  return {
    postcssPlugin: 'postcss-js-to-vars',
    Once(root: Root) {
      if (!root.source.input.file.endsWith(config.target)) return;
      applyStyle(root, styles);
    }
  };
};
module.exports.postcss = true;
