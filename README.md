# comprehension-js
[![Build Status](https://travis-ci.org/mattiaocchiuto/comprehension-js.svg?branch=master)](https://travis-ci.org/phuu/comprehension-js)

List comprehension from haskell to javascript

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
npm build
```
  
## License
This project is licensed under the terms of MIT License. See the LICENSE file for more info.
