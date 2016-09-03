# comprehension-js
List comprehension from haskell to javascript

To easily understand what list comprehensions are in Haskell check out [this link](http://learnyouahaskell.com/starting-out#im-a-list-comprehension).

Examples of use:

1. Passing an input set in the description
  ```javascript
  comprehensions('[x | x<- [1..100], x*2 >= 12, x<100, x*2<160]');
  ```
  will output => [6, 7, 8, 9, 10]

2. Using the generated function with a array
  ```javascript
  var factory = comprehensions('[x | x<- xs, x*2 >= 12, x<100, x*2<160]');
  factory([1,2,3,4,5,6,7,8,9,10]);
  ```
  will output => [6, 7, 8, 9, 10]
  
  
#### License
This project is licensed under the terms of MIT License. See the LICENSE file for more info.
