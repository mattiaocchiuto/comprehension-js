'use strict';

import { expect } from 'chai';
import { comprehensions, completeArray } from '../src/index';

describe('Comprehension Test', function () {
  beforeEach(function () {
    return true;
  });

  afterEach(function () {
    return true;
  });

  describe('Comprehensions function tests', function () {
    it('With generated input', function () {
      let output = comprehensions('[x | x<- [1..100], x*2 >= 12, x<100, x*2<40]');
      
      expect(output).to.eql([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    });

    it('With generated factory', function () {
      let factory = comprehensions('[x | x<- xs, x*2 >= 12, x<100, x*2<40]');
      let output = factory([1,2,3,4,5,6,7,8,9,10]);

      expect(output).to.eql([6, 7, 8, 9, 10]);
    });
  });

  describe('CompleteArray function tests', function () {
    it('With interval signs and no parenthesis', function () {
      let output = completeArray('1..10');

      expect(output).to.eql([1,2,3,4,5,6,7,8,9,10]);
    });

    it('With interval signs and parenthesis', function () {
      let output = completeArray('[1..10]');

      expect(output).to.eql([1,2,3,4,5,6,7,8,9,10]);
    });

    it('With interval signs and parenthesis and start equal to end', function () {
      let output = completeArray('[1..1]');

      expect(output).to.eql([1]);
    });

    it('With interval signs and parenthesis and start less than end', function () {
      let output = completeArray('[1..-1]');

      expect(output).to.eql([]);
    });

    it('With interval signs and parenthesis and interval spec', function () {
      let output = completeArray('[1,3..10]');

      expect(output).to.eql([1,3,5,7,9]);
    });
  });
});
