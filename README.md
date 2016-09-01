# comprehension-js
List comprehension from haskell to javascript


Examples of use:


1.```javascript
comprehensions('[x |x<- [1..100], x*2 >= 12, x<100, x*2<160]  ');
```
=> [6, 7, 8, 9, 10]

2) var factory = comprehensions('[x |x*2 >= 12, x<100, x*2<160]  ');
   factory([1,2,3,4,5,6,7,8,9,10]);

=> [6, 7, 8, 9, 10]