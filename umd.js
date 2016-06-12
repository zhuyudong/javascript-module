(function(window, factory) {
  // 先判断是否支持Node.js的模块
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) { // 再判断是否支持AMD
    define(factory);
  } else {
    window.eventUtil = factory();
  }
})(this, function() {
  
});