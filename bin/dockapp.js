#!/usr/bin/env node
const yargs = require('yargs');
const { cmdVersion, cmdListFormulas, cmdNewApp } = require('../src/cli/cli');
const { name } = require('../package.json');

const argv = yargs
  .command(
    'new [app]',
    'create a new docker app',
    (args) => {
      args.positional('app', {
        describe: 'name of the app'
      });
    },
    async (argv) => {
      await cmdNewApp(argv.app);
    }
  )
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
