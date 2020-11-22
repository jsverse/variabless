import chokidar from 'chokidar';

import { applyVariableRules } from './applyVariableRules';
import { WebpackConfig } from './types';

export class JsToCssVarsWebpackPlugin {
  constructor(private config: WebpackConfig) {
    applyVariableRules(this.config);
  }

  apply() {
    if (!this.config.watch) return;

    const watcher = chokidar.watch(this.config.srcPath, {
      ignored: /(^|[\/\\])\../,
      ignoreInitial: true,
      persistent: true
    });

    for (let trigger of ['add', 'change', 'unlink']) {
      watcher.on(trigger, path => applyVariableRules(this.config));
    }
  }
}
