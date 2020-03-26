const { version } = require('../../package.json');
const {
  readAllFormulas,
  isFormulaFound,
  readFormula
} = require('../util/util');
const { red } = require('chalk');
const { toEnquirerJSON } = require('../parser/parser');
const { prompt } = require('enquirer');

function cmdVersion() {
  console.log(version);
}

function cmdListFormulas() {
  const formulas = readAllFormulas().join('\n');

  console.log(formulas);
}

async function cmdNewApp(name) {
  if (!name) {
    console.log(red('no app name was given, eg. mysql, redis'));
  } else if (!isFormulaFound(name)) {
    console.log(red(`app '${name}' was not found`));
  } else {
    // ask the required questions
    try {
      const formula = readFormula(name);
      const enquirerJSON = toEnquirerJSON(formula);

      await prompt(enquirerJSON);
    } catch (err) {
      /* eslint-disable no-empty */
    }
  }
}

module.exports = {
  cmdVersion,
  cmdListFormulas,
  cmdNewApp
};
