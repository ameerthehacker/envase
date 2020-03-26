const path = require('path');
const fs = require('fs');

const FORMULA_DIR = path.join(process.cwd(), 'src', 'formulas');

function readAllFormulas() {
  const formulas = fs.readdirSync(FORMULA_DIR).map(getFilenameWithoutExt);

  return formulas;
}

function isFormulaFound(formulaName) {
  return fs.existsSync(path.join(FORMULA_DIR, formulaName));
}

function getFilenameWithoutExt(filename) {
  if (filename.includes('.')) {
    const fileSegments = filename.split('.');

    fileSegments.pop();

    return fileSegments.join();
  } else {
    return filename;
  }
}

module.exports = {
  readAllFormulas,
  getFilenameWithoutExt,
  isFormulaFound
};
