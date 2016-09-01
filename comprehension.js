console.clear();

// TODILIST:
// 1) metti polyfill reduce, map, fill

/**
 * @param {String} - test
 * @return {Boolean}
 */
function isInputSet(test) {
  return test.indexOf('<-') != -1;
}

function parseIfNum(val) {
  return !isNaN(parseInt(val)) ? parseInt(val) : val.trim();
}

// Formatta l'array da una scrittura [1..5] a [1,2,3,4,5]
// per ora assumiamo array numerici
function completeArray(arrayString) {
  
  if (arrayString.indexOf('..') != -1) {
    var elems = arrayString.split('..');
    
    var firstElem = parseIfNum(elems[0]);
    var lastElem = parseIfNum(elems[1]);
    
    return Array(lastElem).fill(firstElem).reduce(function (acc, val) {
      var valToAdd = !acc.lastElem ? val : acc.lastElem+1;
      
      acc.result.push(valToAdd);
      acc.lastElem = valToAdd;      
      
      return acc;
    }, { result: [], lastElem: undefined }).result;
  } else {
    return arrayString.split(',').reduce(function (acc, val) {
      acc.push(parseIfNum(val));
      
      return acc;
    }, []);
  }
}

function formatComprehensions(outputExpression, varName, otherArgs) {
  var inputSet;
  var rightSide = otherArgs.split(',');
  var predicates = []; // Filtri da applicare.
 
  rightSide.map(function (el) {
    if (isInputSet(el) && !inputSet) {
      inputSet = el;
    } else {
      predicates.push(el);
    }
  });
  
  function transformationFunction(input) {
    var results = [];
    
    input.map(function (val) {
      var predicatesCondition = false;
      
      this[varName] = val;
      
      predicatesCondition = predicates.reduce(function(acc, predicate) {
        this[varName] = val;
        
        return acc && eval(predicate);
      }, true);
      
      if (predicatesCondition) {
        results.push(eval(outputExpression));
      }
    });
    
    return results;
  }
  
  if (inputSet) {
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
                .replace(/\[(.*([a-z]).*)\|((.*)(,?).*)\]/, '$1||$2||$3');
  
  expressionParams = expression.split('||');
  
  return formatComprehensions(expressionParams[0], expressionParams[1], expressionParams[2]);
}




