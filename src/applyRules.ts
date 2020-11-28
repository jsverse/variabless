import { writeFileSync } from 'fs';

import { buildVariables } from './buildVariables';
import { getRules } from './getRules';
import { Config } from './types';

export function applyRules(config: Config) {
  const rules = getRules(config.srcPath);
  writeFileSync(config.outputPath, buildVariables(rules));
}
