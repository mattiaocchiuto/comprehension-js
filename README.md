# comprehension-js
[![Build Status](https://travis-ci.org/mattiaocchiuto/comprehension-js.svg?branch=master)](https://travis-ci.org/phuu/comprehension-js) [![npm version](https://badge.fury.io/js/comprehension-js.svg)](https://badge.fury.io/js/comprehension-js)

List comprehension from haskell to javascript.

An easy way to build and transform array using a concise and declarative description (thanks to Haskell).

To easily understand what list comprehensions are in Haskell check out [this link](http://learnyouahaskell.com/starting-out#im-a-list-comprehension).

## Installation
From npm
```
npm i comprehension-js
```
```javascript
var comprehensions = require('comprehension-js').comprehensions;
```
From CDN
```html
<script src="https://unpkg.com/comprehension-js/dist/index.min.js"></script>
<script>
var comprehensions = Comprehensions.comprehensions;
</script>
```
## Examples of use:

1. Declaring an input set in the input description section
  ```javascript
  comprehensions('[x | x<- [1..100], x*2 >= 12, x<100, x*2<160]');
  ```
  will output => [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

2. Using the generated function to modifiy an input array
  ```javascript
  var factory = comprehensions('[x | x<- xs, x*2 >= 12, x<100, x*2<160]');
  factory([1,2,3,4,5,6,7,8,9,10]);
  ```
  will output => [6, 7, 8, 9, 10]
  
###Quick description of the input spec
The input spec (in short the string passed to the ```comprehensions``` function) is composed by three main parts: *output function*, *input set*, *filter functions*.

Taking this spec as example: _[x*3 | x<- [1..10], x/2>=2, x*5<160]_ we have that:

1. Each specification has to be enclosed in square brackets
2. The portion before the pipe -_x*3_- is the *output function* indeed the operation here described will be applied at each value of the array
3. The portion after the pipe and before the first comma -_x<- [1..10]_- is the *input set*, here we have some accepted forms:
  1. _x<-[first..last]_ for example x<-[1..10] represent an array composed by the first 10 int [1,2,3,4,5,6,7,8,9,10]
  2. _x<-[first,second..last]_ for example x<-[1,3..10] represent an array where each outut value is evaluated considering the step offset between the first tho values [1,3,5,7,9]
  3. _x<-xs_ considering any kind of array (when this form is used the ```comprehensions```function will be return a factory function especting an input array to which apply the tranformation according to the input spec).
4. The portion after the first array separated by commas -_x/2>=2_, _x*5<16_- represents the filter functions

So, if we call the comprehensions function passing the spec example as input we will receive as output **[12, 15, 18, 21, 24, 27, 30]**.

##Development
Fetch the dependencies by
```
npm install
```
then
### Building
```
npm build
```

### Running test
```
npm test
```
  
## License
This project is licensed under the terms of MIT License. See the LICENSE file for more info.
