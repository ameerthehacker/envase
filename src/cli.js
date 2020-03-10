const { version } = require('../package.json');
const { readAllFormulas } = require('./parser');

function cmdVersion() {
  console.log(version);
}

function cmdListFormulas() {
  const formulas = readAllFormulas().join('\n');

  console.log(formulas);
}

module.exports = {
  cmdVersion,
  cmdListFormulas
};
