;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module and set browser global
    define([], factory());
  } else if (typeof exports !== 'undefined') {
    module.exports = factory();
  } else {
    // Browser globals
    root = factory();
  }
} (function () {
  /**
   * @private
   * @param {String} - test
   * @return {Boolean}
   */
  function _isInputSet(test) {
    return test.indexOf('<-') != -1;
  }

  /**
   * @private
   * @param {Number|String}
   * @param {Number|String} 
   */
  function _parseIfNum(val) {
    return !isNaN(parseInt(val)) ? parseInt(val) : val.trim();
  }

  // Formatta l'array da una scrittura [1..5] a [1,2,3,4,5]
  // per ora assumiamo array numerici
  function completeArray(arrayString) {
    if (typeof arrayString != 'string') {
      throw new TypeError('The "arrayString" parameter has to be a string.');
    }

    if (/\[(.*)\]/.test(arrayString)) {
      arrayString = arrayString.replace(/\[(.*)\]/, '$1');
    }

    if (/(.*\.\..*)/.test(arrayString)) {
      var elems = arrayString.split('..');

      var firstElem = _parseIfNum(elems[0]);
      var lastElem = _parseIfNum(elems[1]);

      return Array(lastElem).fill(firstElem).reduce(function (acc, val) {
        var valToAdd = !acc.lastElem ? val : acc.lastElem + 1;

        acc.result.push(valToAdd);
        acc.lastElem = valToAdd;

        return acc;
      }, { result: [], lastElem: undefined }).result;
    } else {
      return arrayString.split(',').reduce(function (acc, val) {
        acc.push(_parseIfNum(val));

        return acc;
      }, []);
    }
  }

  function formatComprehensions(outputExpression, otherArgs) {
    var inputSet;
    var varName;
    var rightSide = otherArgs.split(',');
    var predicates = []; // Filtri da applicare.

    inputSet = rightSide.shift();

    // Check that an input set has been passed.
    if (!_isInputSet(inputSet)) {
      throw new Error('You have to specify an input set.');
    }

    // Get the varName.
    varName = inputSet.replace(/(\w)<-(.*)/, '$1');

    // Fill the predicates array.
    rightSide.map(function (el) {
      predicates.push(el);
    });

    function transformationFunction(input) {
      var results = [];

      input.map(function (val) {
        var predicatesCondition = false;

        this[varName] = val;

        predicatesCondition = predicates.reduce(function (acc, predicate) {
          this[varName] = val;

          return acc && eval(predicate);
        }, true);

        if (predicatesCondition) {
          results.push(eval(outputExpression));
        }
      });

      return results;
    }

    if (/(.*)<-\[(.*)\]/.test(inputSet)) {
      var inputSetParams = inputSet.replace(/(.*)<-\[(.*)\]/, '$1||$2').split('||');
      var inputSetFormatted = completeArray(inputSetParams[1]);

      return transformationFunction(inputSetFormatted);
    } else {
      return transformationFunction;
    }
  }

  /**
   * @param {String} expression
   * @return {Function}
   */
  function comprehensions(expression) {
    expression = expression
      .replace(/ +/g, '')
      .replace(/\[(.*)\|((.*)(,?).*)\]/, '$1||$2||$3');

    var expressionParams = expression.split('||');

    return formatComprehensions(expressionParams[0], expressionParams[1]);
  }

  return {
    comprehensions: comprehensions,
    completeArray: completeArray
  };
}));