module.exports = (function () {
    // ************ Start Polyfill ************
    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }

    // Production steps of ECMA-262, Edition 5, 15.4.4.19
    // Reference: http://es5.github.io/#x15.4.4.19
    if (!Array.prototype.map) {

        Array.prototype.map = function (callback, thisArg) {

            var T, A, k;

            if (this == null) {
                throw new TypeError(' this is null or not defined');
            }

            // 1. Let O be the result of calling ToObject passing the |this| 
            //    value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal 
            //    method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 1) {
                T = thisArg;
            }

            // 6. Let A be a new array created as if by the expression new Array(len) 
            //    where Array is the standard built-in constructor with that name and 
            //    len is the value of len.
            A = new Array(len);

            // 7. Let k be 0
            k = 0;

            // 8. Repeat, while k < len
            while (k < len) {

                var kValue, mappedValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal 
                //    method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal 
                    //    method of O with argument Pk.
                    kValue = O[k];

                    // ii. Let mappedValue be the result of calling the Call internal 
                    //     method of callback with T as the this value and argument 
                    //     list containing kValue, k, and O.
                    mappedValue = callback.call(T, kValue, k, O);

                    // iii. Call the DefineOwnProperty internal method of A with arguments
                    // Pk, Property Descriptor
                    // { Value: mappedValue,
                    //   Writable: true,
                    //   Enumerable: true,
                    //   Configurable: true },
                    // and false.

                    // In browsers that support Object.defineProperty, use the following:
                    // Object.defineProperty(A, k, {
                    //   value: mappedValue,
                    //   writable: true,
                    //   enumerable: true,
                    //   configurable: true
                    // });

                    // For best browser support, use the following:
                    A[k] = mappedValue;
                }
                // d. Increase k by 1.
                k++;
            }

            // 9. return A
            return A;
        };
    }

    // Production steps of ECMA-262, Edition 5, 15.4.4.21
    // Reference: http://es5.github.io/#x15.4.4.21
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (callback /*, initialValue*/) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }
            var t = Object(this), len = t.length >>> 0, k = 0, value;
            if (arguments.length == 2) {
                value = arguments[1];
            } else {
                while (k < len && !(k in t)) {
                    k++;
                }
                if (k >= len) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }
                value = t[k++];
            }
            for (; k < len; k++) {
                if (k in t) {
                    value = callback(value, t[k], k, t);
                }
            }
            return value;
        };
    }
    // ************ End Polyfill ************

    var PATTERNS = {
        generalStructure: {
            regExp: /\[(.*)\|((.*)(,?).*)\]/,
            outputString: '$1||$2||$3',
            splittingString: '||'
        },
        scopedVar: {
            regExp: /(\w)<-(.*)/,
            outputString: '$1'
        },
        inputSet: {
            regExp: /(.*)<-\[(.*)\]/,
            outputString: '$1||$2',
            splittingString: '||'
        },
        arrayString: {
            regExp: /\[(.*)\]/, 
            outputString: '$1'
        },
        arrayStringToFill: {
            regExp: /(.*)\.\.(.*)/,
            outputString: '$1||$2',
            splittingString: '||'
        },
        test: function (testConfigurationName, testString) {
            return this[testConfigurationName].regExp.test(testString);
        },
        extract: function (extractConfigurationName, extractString) {
            var extractConfiguration = this[extractConfigurationName];
            var regExp = extractConfiguration.regExp;
            var outputString = extractConfiguration.outputString;
            var splittingString = extractConfiguration.splittingString;

            var replacedString = extractString.replace(regExp, outputString);

            return splittingString ? replacedString.split(splittingString) : replacedString;
        }
    };

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
        var interval = 1;

        if (typeof arrayString != 'string') {
            throw new TypeError('The "arrayString" parameter has to be a string.');
        }

        if (PATTERNS.test('arrayString', arrayString)) {
            arrayString = PATTERNS.extract('arrayString', arrayString);
        }

        if (PATTERNS.test('arrayStringToFill', arrayString)) {
            var elems = PATTERNS.extract('arrayStringToFill', arrayString)
            var firstElem;
            var lastElem;

            if (elems[0].indexOf(',') != -1) {
                var firstElemParams = elems[0].split(',');

                interval = _parseIfNum(firstElemParams[1]) - _parseIfNum(firstElemParams[0]);
                firstElem = _parseIfNum(firstElemParams[0]);
            }

            firstElem = _parseIfNum(elems[0]);
            lastElem = _parseIfNum(elems[1]);

            if (lastElem < firstElem) {
                return [];
            }

            return Array(lastElem).fill(firstElem).reduce(function (acc, val) {
                var valToAdd = !acc.lastElem ? val : acc.lastElem + interval;

                if (valToAdd <= lastElem) {
                    acc.result.push(valToAdd);
                    acc.lastElem = valToAdd;
                }

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
        varName = PATTERNS.extract('scopedVar', inputSet);

        // Fill the predicates array.
        rightSide.map(function (el) {
            predicates.push(el);
        });

        /**
         * It take an input array and apply the output-function at the
         * elements respecting the filter functions.
         * @param {Array} - input
         * @return {Array}
         */
        function transformationFunction(input) {
            if (!Array.isArray(input)) {
                throw new TypeError('The input value has to be an Array')
            }

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

        if (PATTERNS.test('inputSet', inputSet)) {
            var inputSetParams = PATTERNS.extract('inputSet', inputSet);
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
        expression = expression.replace(/ +/g, '');

        if (!PATTERNS.test('generalStructure', expression)) {
            throw new Error('The input spec does not match any list comprehensions pattern');
        }

        var expressionParams = PATTERNS.extract('generalStructure', expression);

        return formatComprehensions(expressionParams[0], expressionParams[1]);
    }

    return {
        comprehensions: comprehensions,
        completeArray: completeArray
    };
})();