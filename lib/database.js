const error = require('./error');
const stats = require('./statistical');
const maths = require('./math-trig');
const utils = require('./utils');

function compact(array) {
  if (!array) { return array; }
  let result = [];
  for (let i = 0; i < array.length; ++i) {
    if (!array[i]) { continue; }
    result.push(array[i]);
  }
  return result;
}

exports.FINDFIELD = function (database, title) {
  let index = null;
  for (let i = 0; i < database.length; i++) {
    if (database[i][0] === title) {
      index = i;
      break;
    }
  }

  // Return error if the input field title is incorrect
  if (index == null) {
    return error.value;
  }
  return index;
};

function findResultIndex(database, criterias) {
  let matches = {};
  for (let i = 1; i < database[0].length; ++i) {
    matches[i] = true;
  }
  let maxCriteriaLength = criterias[0].length;
  for (let i = 1; i < criterias.length; ++i) {
    if (criterias[i].length > maxCriteriaLength) {
      maxCriteriaLength = criterias[i].length;
    }
  }

  for (let k = 1; k < database.length; ++k) {
    for (let l = 1; l < database[k].length; ++l) {
      let currentCriteriaResult = false;
      let hasMatchingCriteria = false;
      for (let j = 0; j < criterias.length; ++j) {
        const criteria = criterias[j];
        if (criteria.length < maxCriteriaLength) {
          continue;
        }

        const criteriaField = criteria[0];
        if (database[k][0] !== criteriaField) {
          continue;
        }
        hasMatchingCriteria = true;
        for (let p = 1; p < criteria.length; ++p) {
          currentCriteriaResult = currentCriteriaResult || eval(database[k][l] + criteria[p]);  // jshint ignore:line
        }
      }
      if (hasMatchingCriteria) {
        matches[l] = matches[l] && currentCriteriaResult;
      }
    }
  }

  let result = [];
  for (let n = 0; n < database[0].length; ++n) {
    if (matches[n]) {
      result.push(n - 1);
    }
  }
  return result;
}

// Database functions
exports.DAVERAGE = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  let sum = 0;
  for (let i = 0; i < resultIndexes.length; i++) {
    sum += targetFields[resultIndexes[i]];
  }
  return resultIndexes.length === 0 ? error.div0 : sum / resultIndexes.length;
};

exports.DCOUNT = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  const targetValues = [];
  for (let i = 0; i < resultIndexes.length; i++) {
    targetValues[i] = targetFields[resultIndexes[i]];
  }
  return stats.COUNT(targetValues);
};

exports.DCOUNTA = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  const targetValues = [];
  for (let i = 0; i < resultIndexes.length; i++) {
    targetValues[i] = targetFields[resultIndexes[i]];
  }
  return stats.COUNTA(targetValues);
};

exports.DGET = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  // Return error if no record meets the criteria
  if (resultIndexes.length === 0) {
    return error.value;
  }
  // Returns the #NUM! error value because more than one record meets the
  // criteria
  if (resultIndexes.length > 1) {
    return error.num;
  }

  return targetFields[resultIndexes[0]];
};

exports.DMAX = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  let maxValue = targetFields[resultIndexes[0]];
  for (let i = 1; i < resultIndexes.length; i++) {
    if (maxValue < targetFields[resultIndexes[i]]) {
      maxValue = targetFields[resultIndexes[i]];
    }
  }
  return maxValue;
};

exports.DMIN = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  let minValue = targetFields[resultIndexes[0]];
  for (let i = 1; i < resultIndexes.length; i++) {
    if (minValue > targetFields[resultIndexes[i]]) {
      minValue = targetFields[resultIndexes[i]];
    }
  }
  return minValue;
};

exports.DPRODUCT = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  let targetValues = [];
  for (let i = 0; i < resultIndexes.length; i++) {
    targetValues[i] = targetFields[resultIndexes[i]];
  }
  targetValues = compact(targetValues);
  let result = 1;
  for (let i = 0; i < targetValues.length; i++) {
    result *= targetValues[i];
  }
  return result;
};

exports.DSTDEV = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  let targetValues = [];
  for (let i = 0; i < resultIndexes.length; i++) {
    targetValues[i] = targetFields[resultIndexes[i]];
  }
  targetValues = compact(targetValues);
  return stats.STDEV.S(targetValues);
};

exports.DSTDEVP = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  let targetValues = [];
  for (let i = 0; i < resultIndexes.length; i++) {
    targetValues[i] = targetFields[resultIndexes[i]];
  }
  targetValues = compact(targetValues);
  return stats.STDEV.P(targetValues);
};

exports.DSUM = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  const targetValues = [];
  for (let i = 0; i < resultIndexes.length; i++) {
    targetValues[i] = targetFields[resultIndexes[i]];
  }
  return maths.SUM(targetValues);
};

exports.DVAR = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  const targetValues = [];
  for (let i = 0; i < resultIndexes.length; i++) {
    targetValues[i] = targetFields[resultIndexes[i]];
  }
  return stats.VAR.S(targetValues);
};

exports.DVARP = function (database, field, criteria) {
  // Return error if field is not a number and not a string
  if (isNaN(field) && (utils.gettype(field) !== 'string')) {
    return error.value;
  }
  const resultIndexes = findResultIndex(database, criteria);
  let targetFields = [];
  if (utils.gettype(field) === 'string') {
    const index = exports.FINDFIELD(database, field);
    targetFields = utils.rest(database[index]);
  } else {
    targetFields = utils.rest(database[field]);
  }
  const targetValues = [];
  for (let i = 0; i < resultIndexes.length; i++) {
    targetValues[i] = targetFields[resultIndexes[i]];
  }
  return stats.VAR.P(targetValues);
};
