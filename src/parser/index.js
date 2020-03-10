const fs = require("fs");
const path = require("path");

function validate(formulaName, formula) {
  const knownTypes = ["string", "number", "password"];

  // throw if image is not string
  if (formula.image && typeof formula.image !== "string") {
    throw new Error(`${formulaName}: image property must be a string`);
  }

  // throw if the image is not defined
  if (!formula.image || formula.image.trim().length === 0) {
    throw new Error(`${formulaName} has no docker image specified`);
  }

  if (formula.data) {
    if (typeof formula.data !== "object") {
      // throw if type property is not given
      throw new Error(`${formulaName}: data proprty must be an object`);
    }

    for (let field in formula.data) {
      const fieldData = formula.data[field];

      if (!fieldData.type) {
        throw new Error(
          `${formulaName}: field \`${field}\` has no type property`
        );
      }

      if (!knownTypes.find(knownType => knownType === fieldData.type)) {
        throw new Error(
          `${formulaName}: field \`${field}\` has unknown type \`${fieldData.type}\``
        );
      }
    }
  }
}

function interpolate(template, data) {
  for (let key in data) {
    template = template.replace(new RegExp(`%${key}%`, "ig"), data[key]);
  }

  return template;
}

function readAllFormulas() {
  const formulaDir = path.join(process.cwd(), "src", "formulas");

  const formulas = fs.readdirSync(formulaDir);

  return formulas;
}

module.exports = {
  validate,
  interpolate,
  readAllFormulas
};
