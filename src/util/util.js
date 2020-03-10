const path = require('path');
const fs = require('fs');

function readAllFormulas() {
  const formulaDir = path.join(process.cwd(), 'src', 'formulas');

  const formulas = fs.readdirSync(formulaDir).map(getFilenameWithoutExt);

  return formulas;
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
  getFilenameWithoutExt
};
