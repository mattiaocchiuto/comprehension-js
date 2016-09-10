var comprehensions = require('./dist/index.min.js').comprehensions;

console.log(comprehensions('[x | x<- [1..100], x*2 >= 12, x<100, x*2<160]'));