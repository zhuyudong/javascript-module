//foo.js
var request = require('request').default({
  timeout: 4000
});

module.exports = function() {
  this.re = '';
  this.req = function(url) {
    request(url, function(error, status, res) {
      this.re = res;
    });
  }
};

//main.js
var Foo = require('./foo');
var foo = new Foo();
foo.req('http://www.haiziwang.com');

console.log(foo.re);