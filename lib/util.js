'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validate = validate;
exports.markProcessed = markProcessed;
exports.isProcessed = isProcessed;
exports.getLocation = getLocation;

var _path = require('path');

function validate(leadingComments, state) {
    var _state$opts$ignore = state.opts.ignore,
        ignore = _state$opts$ignore === undefined ? [] : _state$opts$ignore,
        filename = getFilename(state);


    if (ignore.some(function (regexp) {
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