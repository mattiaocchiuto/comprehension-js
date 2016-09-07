'use strict';

let expect = require('chai').expect;
let comprehensions = require('../src/index.js').comprehensions;
let completeArray = require('../src/index.js').completeArray;

describe('Comprehension Test', () => {
  beforeEach(() => {
    return true;
  });

  afterEach(() => {
    return true;
  });

  describe('Comprehensions function tests', () => {
    it('With generated input', () => {
      var output = comprehensions('[x | x<- [1..100], x*2 >= 12, x<100, x*2<40]');
      
      expect(output).to.eql([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    });

    it('With generated factory', () => {
      var factory = comprehensions('[x | x<- xs, x*2 >= 12, x<100, x*2<40]');
      var output = factory([1,2,3,4,5,6,7,8,9,10]);

      expect(output).to.eql([6, 7, 8, 9, 10]);
    });
  });

  describe('CompleteArray function tests', () => {
    it('With interval signs and no parenthesis', () => {
      var output = completeArray('1..10');

      expect(output).to.eql([1,2,3,4,5,6,7,8,9,10]);
    });

    it('With interval signs and parenthesis', () => {
      var output = completeArray('[1..10]');

      expect(output).to.eql([1,2,3,4,5,6,7,8,9,10]);
    });

    it('With interval signs and parenthesis and start equal to end', () => {
      var output = completeArray('[1..1]');

      expect(output).to.eql([1]);
    });

    it('With interval signs and parenthesis and start less than end', () => {
      var output = completeArray('[1..-1]');

      expect(output).to.eql([]);
    });

    it('With interval signs and parenthesis and interval spec', () => {
      var output = completeArray('[1,3..10]');

      expect(output).to.eql([1,3,5,7,9]);
    });
  });
});
