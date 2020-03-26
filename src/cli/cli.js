const { version } = require('../../package.json');
const { readAllFormulas, isFormulaFound } = require('../util/util');
const { red } = require('chalk');

function cmdVersion() {
  console.log(version);
}

function cmdListFormulas() {
  const formulas = readAllFormulas().join('\n');

  console.log(formulas);
}

function cmdNewApp(name) {
  if (!name) {
    console.log(red('no app name was given, eg. mysql, redis'));
  } else if (!isFormulaFound(name)) {
    console.log(red(`app '${name}' was not found`));
  } else {
    // create the app
  }
}

module.exports = {
  cmdVersion,
  cmdListFormulas,
  cmdNewApp
};
