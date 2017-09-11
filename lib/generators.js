'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateAssert = generateAssert;

var _doctrine = require('doctrine');

var _doctrine2 = _interopRequireDefault(_doctrine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateAssert(_ref) {
    var validation = _ref.validation,
        location = _ref.location,
        tag = _ref.tag,
        _ref$options = _ref.options,
        mode = _ref$options.mode,
        logger = _ref$options.logger;
    var name = tag.name,
        type = _doctrine2.default.type.stringify(tag.type, { compact: true });


    var message = '\'' + location + ': Expected `' + name + '` to have type ' + type + ', got: \' + (typeof ' + name + ')';

    return 'if (!' + validation + ') {' + generateWarn({ message: message, mode: mode, logger: logger }) + '}';
}


function generateWarn(_ref2) {
    var message = _ref2.message,
        mode = _ref2.mode,
        logger = _ref2.logger;

    if (logger) {
        return logger + ('(' + message + ')');
    } else {
        return (generators[mode] || generators.warn)({ message: message });
    }
}

var generators = {
    warn: function warn(_ref3) {
        var message = _ref3.message;
        return '\n        console._warn(' + message + ');\n    ';
    },
    debugger: function _debugger(_ref4) {
        var message = _ref4.message;
        return '\n        console.warn(' + message + ');\n        debugger;\n    ';
    },
    trace: function trace(_ref5) {
        var message = _ref5.message;
        return '\n        console.trace(' + message + ');\n    ';
    },
    throw: function _throw(_ref6) {
        var message = _ref6.message;
        return '\n        throw new Error(' + message + ');\n    ';
    }
};
//# sourceMappingURL=generators.js.map