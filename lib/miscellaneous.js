const utils = require('./utils');
const numeral = require('numeral');

exports.UNIQUE = function () {
  const result = [];
  for (let i = 0; i < arguments.length; ++i) {
    let hasElement = false;
    const element = arguments[i];

    // Check if we've already seen this element.
    for (let j = 0; j < result.length; ++j) {
      hasElement = result[j] === element;
      if (hasElement) { break; }
    }

    // If we did not find it, add it to the result.
    if (!hasElement) {
      result.push(element);
    }
  }
  return result;
};

exports.FLATTEN = utils.flatten;

exports.ARGS2ARRAY = function () {
  return Array.prototype.slice.call(arguments, 0);
};

exports.REFERENCE = function (context, reference) {
  try {
    const path = reference.split('.');
    let result = context;
    for (let i = 0; i < path.length; ++i) {
      const step = path[i];
      if (step[step.length - 1] === ']') {
        const opening = step.indexOf('[');
        const index = step.substring(opening + 1, step.length - 1);
        result = result[step.substring(0, opening)][index];
      } else {
        result = result[step];
      }
    }
    return result;
  } catch (error) { }
};

exports.JOIN = function (array, separator) {
  return array.join(separator);
};

exports.NUMBERS = function () {
  const possibleNumbers = utils.flatten(arguments);
  return possibleNumbers.filter(function (el) {
    return utils.gettype(el) === 'number';
  });
};

exports.NUMERAL = function (number, format) {
  return numeral(number).format(format);
};