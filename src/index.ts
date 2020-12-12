#!/usr/bin/env node
// import-conductor-skip
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import ora from 'ora';

// @ts-ignore
import pck from './package.json';
import { optionDefinitions, sections } from './cliOptions';
import { applyRules } from './applyRules';

const mainDefinitions = [{ name: 'command', defaultOption: true }];

const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
const argv = mainOptions._unknown || [];

const config = commandLineArgs(optionDefinitions, {
  camelCase: true,
  argv
});
const { help, version } = config;

if (help || version) {
  const output = help ? commandLineUsage(sections) : pck.version;
  console.log(output);
  process.exit();
}

const spinner = ora({ spinner: { frames: ['•'] } }).start('Generating CSS file 🎨\n');
applyRules(config);
spinner.succeed('Generated file successfully 💎\n');
