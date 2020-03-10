const path = require('path');
const fs = require('fs');

function readAllFormulas() {
  const formulaDir = path.join(process.cwd(), 'src', 'formulas');

  const formulas = fs.readdirSync(formulaDir);

  return formulas;
}

module.exports = {
  readAllFormulas
};
