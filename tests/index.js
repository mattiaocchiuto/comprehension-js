'use strict';

let expect = require('chai').expect;
let comprehensions = require('../src/comprehension.js').comprehensions;

describe('Comprehension Test', () => {
  beforeEach(() => {
    return true;
  });

  afterEach(() => {
    return true;
  });

  describe('Base test', () => {
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
});
