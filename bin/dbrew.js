#!/usr/bin/env node
const yargs = require('yargs');
const { cmdVersion, cmdListFormulas } = require('../src/cli');
const { name } = require('../package.json');

const argv = yargs
  .command('new [app]', 'create a new docker app', (args) => {
    args.positional('app', 'name of the app');
  })
  .command('ls', 'list all available formulas', () => {
    cmdListFormulas();
  })
  .option('version', {
    alias: 'v',
    description: `version of ${name}`
  }).argv;

if (argv.version) {
  cmdVersion();
}
