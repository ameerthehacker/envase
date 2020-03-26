function validate(formulaName, formula) {
  const knownTypes = ['string', 'number', 'password'];

  // throw if image is not string
  if (formula.image && typeof formula.image !== 'string') {
    throw new Error(`${formulaName}: image property must be a string`);
  }

  // throw if the image is not defined
  if (!formula.image || formula.image.trim().length === 0) {
    throw new Error(`${formulaName} has no docker image specified`);
  }

  if (formula.data) {
    if (typeof formula.data !== 'object') {
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

      if (!knownTypes.find((knownType) => knownType === fieldData.type)) {
        throw new Error(
          `${formulaName}: field \`${field}\` has unknown type \`${fieldData.type}\``
        );
      }
    }
  }
}

function interpolate(template, data) {
  for (let key in data) {
    template = template.replace(new RegExp(`%${key}%`, 'ig'), data[key]);
  }

  return template;
}

function getEnquirerType(type) {
  switch (type) {
    case 'string':
      return 'input';
    case 'password':
      return 'password';
    case 'number':
      return 'input';
    default:
      throw new Error(
        `getEnquirerType(): ${type} equivalent for enquirer was not found`
      );
  }
}

function toEnquirerJSON(formula) {
  const enquiredJSON = [];
  const { data } = formula;

  for (const key in data) {
    const question = {
      name: key,
      message: data[key].description,
      type: getEnquirerType(data[key].type),
      required: data[key].required
    };

    if (data[key].default) {
      question.default = data[key].default;
    }

    enquiredJSON.push(question);
  }

  return enquiredJSON;
}

module.exports = {
  validate,
  interpolate,
  toEnquirerJSON,
  getEnquirerType
};
