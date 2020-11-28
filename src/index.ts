import chokidar from 'chokidar';

import { applyRules } from './applyRules';
import { WebpackConfig } from './types';

export class VariablessWebpackPlugin {
  constructor(private config: WebpackConfig) {
    applyRules(this.config);
  }

  apply() {
    if (!this.config.watch) return;

    const watcher = chokidar.watch(this.config.srcPath, {
      ignored: /(^|[\/\\])\../,
      ignoreInitial: true,
      persistent: true
    });

    for (let trigger of ['add', 'change', 'unlink']) {
      watcher.on(trigger, path => applyRules(this.config));
    }
  }
}
