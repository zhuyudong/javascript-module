// 1、原始写法：污染全局变量、命名冲突、模块成员间无直观联系
function func1() {
}
function func2() {
}

// 2、对象写法：对外暴露模块成员，内部状态可被改写 module1._count = 5;
var module_object = new Object({
  _count: 0,
  func1: function() {
  },
  func2: function() {
  }
});
module.func1();

// 3、匿名闭包/立即执行（可自由定义导出内部哪个对象）：外部无法读取内部的_count变量
(function(){
})();
(function(){
}());
var module_closure = (function() {
  var _count = 0;
  var func1 = function() {};
  var func2 = function() {};
  return {
    func1: func1,
    func2: func2
  };
})();

// 4、全局导入/放大模式（argmentation）：继承另一个模块添加方法并返回新模块，或者避免在模块内部调用全局变量（不直接与程序的其他部分交互，相当于内部变量，提高执行效率）
var moduleAugmentation = (function($, YAHOO){
  $.newmethod = function() {
  };
  return $;
  //或者仅仅作为外部传进来的内部变量使用
}(jQuery, YAHOO));

// 5、宽扩容模式（Loose augmentation）：避免上面可能传入空对象的风险
var moduleLooseAugmentation = (function(module){
  module.newMethod = function(){
  };
  return module;
}(module || {}));

// 6、克隆和继承
var moduleClone = (function(superModule){
  var childModule = {},
      key;
  for (key in superModule) {
    if (superModule.hasProperty()) {
      childModule[key] = superModule[key];
    }
  }
  var super_moduleMethod = superModule.moduleMethod;
  childModule.moduleMthod = function(){
  };
  return childModule;
}(MODULE));

// 7、CommonJS：但是在浏览器端存在异步加载和不能识别require的问题
var math = require('math');
math.add(2, 3);

//8、AMD（Asynchronous Module Definition）：采用异步回调的模式和管理模块间的依赖，有require.js、curl.js，在其不断进化的过程中路径、多路请求、加载非规范的模块、插件等问题都得到解决
//使用方式（body底部）：<script src="js/require.js" defer async="true" data-main="main"></script>
// define(id?, dependencies?, function(){return moduleContent})
//math.js
define(['dependentModule'], function() { //依赖提前声明，无需静态分析
  function foo() {
    dependentMoule.method(); //依赖其他模块
  }
  var add = function() {
    return x + y;
  };
  return {
    add: add,
    foo: foo
  };
});
//兼容commonjs规范
define(function(require, exports, module) {
  var module1 = require('module1');
  var module2 = require('module2');
  module1.doTehAwesome();
  module2.doMoarAwesome();
  exports.asplode = function() {
    module1.doTehAwesome();
    module2.doMoarAwesome();
  };
});
require.config({
  baseUrl: 'js/lib',
  paths: { //本地其他目录或网络请求资源
    'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
    'underscore': 'underscore.min.js',
    'backbone': 'backbone.min.js'
  },
  shim: { //转化非AMD定义的模块
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'], //依赖其他模块
      exports: 'Backbone'
    },
    'jquery.scoll': { //类库插件
      deps: ['jquery'],
      exports: 'jQuery.fn.scorll'
    }
  }
});
//加载规范、非规范的模块和处理dom、文本、图片的插件
require(['jquery', 'underscore', 'backbone', 'math', 'domready!', 'text!review.txt', 'image!cat.jpg'], function($, _, Backbone,  math, doc, review, cat) {
  math.add(1, 2);
  console.log(review);
  document.body.appendChild(cat);
});

// 9、CMD
define('a', function(require, exports, module) {
  var b = require('./b');
  var c = require('./c');
  exports.run = function() {
    console.log('a.run');
  };
});

// 10、CommonJS模块
var dependency = require('xxx');
exports.xxx = xxx;
module.exports = moduleContent;
//所有代码都运行在模块作用域，不会污染全局作用域。
//模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
//模块加载的顺序，按照其在代码中出现的顺序。
function Module(id, filename, loaded, parent, children, exports) {
  this.id = id; // 模块的识别符，绝对路径的模块文件名
  this.filename = filename; // 带有绝对路径的模块文件名
  this.loaded; // 模块是否已加载完成
  this.parent = parent; // 调用该模块的模块
  this.children = children; // 该模块要用到的其他模块的数组
  this.exports = exports; // 模块对外的输出
}

// 11、兼容AMD、CMD、CommonJS规范
;(function(name, definition) {
    //检测上下文是否为AMD或CMD
    var hasDefine = typeof define === 'function';
    //检测上下文是否为node
    hasExports = typeof module !== 'undefined' && module.hasExports;
    
    if (hasDefine) {
        // AMD或CMD环境
        define(definition);
    } else if (hasExports) {
        // 定义为普通node模块
        module.exports = definition();
    } else {
        //将模块的执行结果挂在window变量上，在浏览器中this指向window对象
        this[name] = definition();
    }
    
})('hello', function() {
    var hello = function() {};
    return hello;
});

// 12、UMD
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['b'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('b'));
  } else {
    // Browser globals (root is window)
    root.returnExports = factory(root.b);
  }
}(this, function(b) {
  //use b in some fashion.
  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return {};
}));