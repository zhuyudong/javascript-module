# javascript-module
javascript模块化的前世今生

符合CommonJS规范的文件，一个单独的文件就是一个模块。

CommonJS加载模块是同步的

AMD运行时核心思想是Early Executing，即提前依赖执行，推崇依赖前置。
RequiresJS想成为浏览器端和Rhino/Node环境的模块加载器。
Sea.js则专注于Web浏览器端，同时通过Node扩展的方式可以很方便的跑在Node环境中。

RequireJS在尝试让第三方类库修改自身来支持RequireJS。
CMD是延迟执行，推崇依赖就近，按需加载。

UMD是AMD和CommonJS的糅合。