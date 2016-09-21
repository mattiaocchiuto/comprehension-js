'use strict';

module.exports = (function () {
    let PATTERNS = {
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
            let extractConfiguration = this[extractConfigurationName];
            let regExp = extractConfiguration.regExp;
            let outputString = extractConfiguration.outputString;
            let splittingString = extractConfiguration.splittingString;

            let replacedString = extractString.replace(regExp, outputString);

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
        let interval = 1;

        if (typeof arrayString != 'string') {
            throw new TypeError('The "arrayString" parameter has to be a string.');
        }

        if (PATTERNS.test('arrayString', arrayString)) {
            arrayString = PATTERNS.extract('arrayString', arrayString);
        }

        if (PATTERNS.test('arrayStringToFill', arrayString)) {
            let elems = PATTERNS.extract('arrayStringToFill', arrayString)
            let firstElem;
            let lastElem;

            if (elems[0].indexOf(',') != -1) {
                let firstElemParams = elems[0].split(',');

                interval = _parseIfNum(firstElemParams[1]) - _parseIfNum(firstElemParams[0]);
                firstElem = _parseIfNum(firstElemParams[0]);
            }

            firstElem = _parseIfNum(elems[0]);
            lastElem = _parseIfNum(elems[1]);

            if (lastElem < firstElem) {
                return [];
            }

            return Array(lastElem).fill(firstElem).reduce(function (acc, val) {
                let valToAdd = !acc.lastElem ? val : acc.lastElem + interval;

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
        let inputSet;
        let varName;
        let rightSide = otherArgs.split(',');
        let predicates = []; // Filtri da applicare.

        inputSet = rightSide.shift();

        // Check that an input set has been passed.
        if (!_isInputSet(inputSet)) {
            throw new Error('You have to specify an input set.');
        }

        // Get the varName.
        varName = PATTERNS.extract('scopedVar', inputSet);

        // Fill the predicates array.
        rightSide.map((el) => {
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

            let results = [];
            let scope = '';

            input.map((val) => {
                let predicatesCondition = false;

                scope = `var ${varName} = ${val};`;

                predicatesCondition = predicates.reduce((acc, predicate) => {
                    return acc && eval(`${scope} ${predicate};`);
                }, true);

                if (predicatesCondition) {
                    results.push(eval(`${scope} ${outputExpression};`));
                }
            });

            return results;
        }

        if (PATTERNS.test('inputSet', inputSet)) {
            let inputSetParams = PATTERNS.extract('inputSet', inputSet);
            let inputSetFormatted = completeArray(inputSetParams[1]);
            
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

        let expressionParams = PATTERNS.extract('generalStructure', expression);

        return formatComprehensions(expressionParams[0], expressionParams[1]);
    }

    return {
        comprehensions,
        completeArray
    };
})();