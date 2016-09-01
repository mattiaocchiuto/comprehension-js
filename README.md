# comprehension-js
List comprehension from haskell to javascript


Examples of use:

1. Passing an input set in the description
  ```javascript
  comprehensions('[x |x<- [1..100], x*2 >= 12, x<100, x*2<160]  ');
  ```
  will output => [6, 7, 8, 9, 10]

2. Using the generated function with a array
  ```javascript
  var factory = comprehensions('[x |x*2 >= 12, x<100, x*2<160]  ');
  factory([1,2,3,4,5,6,7,8,9,10]);
  ```
  will output => [6, 7, 8, 9, 10]
