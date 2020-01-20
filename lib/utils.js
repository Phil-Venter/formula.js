var error = require('./error');

function flattenShallow(array) {
  if (!array || !array.reduce) { return array; }
  return array.reduce(function (a, b) {
    var aIsArray = exports.gettype(a) === 'array';
    var bIsArray = exports.gettype(b) === 'array';
    if (aIsArray && bIsArray) {
      return a.concat(b);
    }
    if (aIsArray) {
      a.push(b);
      return a;
    }
    if (bIsArray) {
      return [a].concat(b);
    }
    return [a, b];
  });
}

function isFlat(array) {
  if (!array) { return false; }
  for (var i = 0; i < array.length; ++i) {
    if (exports.gettype(array[i]) === 'array') {
      return false;
    }
  }
  return true;
}

exports.flatten = function () {
  var result = exports.argsToArray.apply(null, arguments);
  while (!isFlat(result)) {
    result = flattenShallow(result);
  }
  return result;
};

exports.argsToArray = function (args) {
  return Array.prototype.slice.call(args, 0);
};

exports.numbers = function () {
  var possibleNumbers = this.flatten.apply(null, arguments);
  return possibleNumbers.filter(function (el) {
    return exports.gettype(el) === 'number';
  });
};

exports.cleanFloat = function (number) {
  var power = 1e14;
  return Math.round(number * power) / power;
};

exports.parseBool = function (bool) {
  if (exports.gettype(bool) === 'boolean') {
    return bool;
  }

  if (exports.gettype(bool) === 'error') {
    return bool;
  }

  if (exports.gettype(bool) === 'number') {
    return bool !== 0;
  }

  if (exports.gettype(bool) === 'string') {
    var up = bool.toUpperCase();
    if (up === 'TRUE') {
      return true;
    }

    if (up === 'FALSE') {
      return false;
    }
  }

  if (exports.gettype(bool) === 'date' && !isNaN(bool)) {
    return true;
  }

  return error.value;
};

exports.parseNumber = function (string) {
  if (string === undefined || string === '') {
    return error.value;
  }
  if (!isNaN(string)) {
    return parseFloat(string);
  }
  return error.value;
};

exports.parseNumberArray = function (arr) {
  var len;
  if (!arr || (len = arr.length) === 0) {
    return error.value;
  }
  var parsed;
  while (len--) {
    parsed = exports.parseNumber(arr[len]);
    if (parsed === error.value) {
      return parsed;
    }
    arr[len] = parsed;
  }
  return arr;
};

exports.parseMatrix = function (matrix) {
  var n;
  if (!matrix || (n = matrix.length) === 0) {
    return error.value;
  }
  var pnarr;
  for (var i = 0; i < matrix.length; i++) {
    pnarr = exports.parseNumberArray(matrix[i]);
    matrix[i] = pnarr;
    if (exports.gettype(pnarr) === 'error') {
      return pnarr;
    }
  }
  return matrix;
};

var d1900 = new Date(1900, 0, 1);
exports.parseDate = function (date) {
  if (!isNaN(date)) {
    if (exports.gettype(date) === 'date') {
      return new Date(date);
    }
    var d = parseInt(date, 10);
    if (d < 0) {
      return error.num;
    }
    if (d <= 60) {
      return new Date(d1900.getTime() + (d - 1) * 86400000);
    }
    return new Date(d1900.getTime() + (d - 2) * 86400000);
  }
  if (exports.gettype(date) === 'string') {
    date = new Date(date);
    if (!isNaN(date)) {
      return date;
    }
  }
  return error.value;
};

exports.parseDateArray = function (arr) {
  var len = arr.length;
  var parsed;
  while (len--) {
    parsed = this.parseDate(arr[len]);
    if (parsed === error.value) {
      return parsed;
    }
    arr[len] = parsed;
  }
  return arr;
};

exports.anyIsError = function () {
  var n = arguments.length;
  while (n--) {
    if (exports.gettype(arguments[n]) === 'error') {
      return true;
    }
  }
  return false;
};

exports.arrayValuesToNumbers = function (arr) {
  var n = arr.length;
  var el;
  while (n--) {
    el = arr[n];
    if (exports.gettype(el) === 'number') {
      continue;
    }
    if (el === true) {
      arr[n] = 1;
      continue;
    }
    if (el === false) {
      arr[n] = 0;
      continue;
    }
    if (exports.gettype(el) === 'string') {
      var number = this.parseNumber(el);
      if (exports.gettype(number) === 'error') {
        arr[n] = 0;
      } else {
        arr[n] = number;
      }
    }
  }
  return arr;
};

exports.rest = function (array, idx) {
  idx = idx || 1;
  if (!array || exports.gettype(array.slice) !== 'function') {
    return array;
  }
  return array.slice(idx);
};

exports.initial = function (array, idx) {
  idx = idx || 1;
  if (!array || exports.gettype(array.slice) !== 'function') {
    return array;
  }
  return array.slice(0, array.length - idx);
};

exports.gettype = function (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}