# jsdoc-to-condition [![Build Status][1]][2]
                     
 [1]: https://travis-ci.org/jakwuh/babel-plugin-jsdoc-to-condition.svg?branch=master
 [2]: https://travis-ci.org/jakwuh/babel-plugin-jsdoc-to-condition

> Babel plugin which сreates validation code from jsdoc comments

### Example

Before:

```js
/**
 * @param {number} param - this is a param.
 * @param {string} b - this is a param.
 * @param {string[]} [c] - this is a param.
 */
function lonelyFunction(param, b, c) {
}
```

After:

```js
/**␊
 * @param {number} param - this is a param.␊
 * @param {string} b - this is a param.␊
 * @param {string[]} [c] - this is a param.␊
 */
function lonelyFunction(param, b, c) {
  if (!(typeof param === 'number')) {
    console._warn('actual.js:6:0: Expected `param` to have type number, got: ' + typeof param);␊
  }

  if (!(typeof b === 'string')) {
    console._warn('actual.js:6:0: Expected `b` to have type string, got: ' + typeof b);
  }

  if (!(c === undefined || Array.isArray(c) && c.every(function (n) {
    return typeof n === 'string';
  }))) {
    console._warn('actual.js:6:0: Expected `c` to have type Array.<string>=, got: ' + typeof c);
  }
}
```

### Usage

```bash
yarn add babel-plugin-jsdoc-to-condition --deb
```

```json
// .babelrc
{
    "plugins": [
        ["babel-plugin-jsdoc-to-condition", {
            "ignore": ["node_modules/"],
            "logger": "debugger; console.info"
        }]
    ]
}
```



