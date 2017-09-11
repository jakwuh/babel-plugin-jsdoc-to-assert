'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validate = validate;
exports.markProcessed = markProcessed;
exports.isProcessed = isProcessed;
exports.getLocation = getLocation;

var _path = require('path');

var _escapeRegexString = require('escape-regex-string');

var _escapeRegexString2 = _interopRequireDefault(_escapeRegexString);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildRegex(strOrRegex) {
    return (0, _lodash.isRegExp)(strOrRegex) ? strOrRegex : new RegExp((0, _escapeRegexString2.default)(strOrRegex));
}
function validate(leadingComments, state) {
    var _state$opts$ignore = state.opts.ignore,
        ignore = _state$opts$ignore === undefined ? [] : _state$opts$ignore,
        filename = getFilename(state);


    if (ignore.map(buildRegex).some(function (regexp) {
        return regexp.test(filename);
    })) {
        return false;
    }

    return leadingComments && leadingComments.length && leadingComments.every(function (comment) {
        return comment.type === 'CommentBlock';
    });
}

function markProcessed(path) {
    Object.defineProperty(path, '__jsdoc_to_assert_checked__', {
        enumerable: false,
        value: true
    });
}

function isProcessed(path) {
    return path.__jsdoc_to_assert_checked__;
}

function getLocation(path, state) {
    var filename = getFilename(state),
        start = path.node.loc.start;


    return (0, _path.basename)(filename) + (':' + start.line + ':' + start.column);
}

function getFilename(state) {
    return state.file.opts.filename;
}
//# sourceMappingURL=util.js.map