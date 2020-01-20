const error = require('./error');
const utils = require('./utils');
const information = require('./information');

exports.AND = function () {
  const args = utils.flatten(arguments);
  let result = true;
  for (let i = 0; i < args.length; i++) {
    if (!args[i]) {
      result = false;
    }
  }
  return result;
};

exports.CHOOSE = function () {
  if (arguments.length < 2) {
    return error.na;
  }

  const index = arguments[0];
  if (index < 1 || index > 254) {
    return error.value;
  }

  if (arguments.length < index + 1) {
    return error.value;
  }

  return arguments[index];
};

exports.FALSE = function () {
  return false;
};

exports.IF = function (test, then_value, otherwise_value) {
  return test ? then_value : otherwise_value;
};

exports.IFERROR = function (value, valueIfError) {
  if (information.ISERROR(value)) {
    return valueIfError;
  }
  return value;
};

exports.IFNA = function (value, value_if_na) {
  return value === error.na ? value_if_na : value;
};

exports.NOT = function (logical) {
  return !logical;
};

exports.OR = function () {
  const args = utils.flatten(arguments);
  let result = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i]) {
      result = true;
    }
  }
  return result;
};

exports.TRUE = function () {
  return true;
};

exports.XOR = function () {
  const args = utils.flatten(arguments);
  let result = 0;
  for (let i = 0; i < args.length; i++) {
    if (args[i]) {
      result++;
    }
  }
  return (Math.floor(Math.abs(result)) & 1) ? true : false;
};

exports.SWITCH = function () {
  let result;
  if (arguments.length > 0) {
    const targetValue = arguments[0];
    const argc = arguments.length - 1;
    const switchCount = Math.floor(argc / 2);
    let switchSatisfied = false;
    const defaultClause = argc % 2 === 0 ? null : arguments[arguments.length - 1];

    if (switchCount) {
      for (let index = 0; index < switchCount; index++) {
        if (targetValue === arguments[index * 2 + 1]) {
          result = arguments[index * 2 + 2];
          switchSatisfied = true;
          break;
        }
      }
    }

    if (!switchSatisfied && defaultClause) {
      result = defaultClause;
    }
  }

  return result;
};
