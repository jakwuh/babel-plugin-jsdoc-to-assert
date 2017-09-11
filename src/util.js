// @flow
import {basename} from 'path';

export function validate(leadingComments: string[] | null, state: any) {
    let {opts: {ignore = []}} = state,
        filename = getFilename(state);

    if (ignore.some(regexp => regexp.test(filename))) {
        return false;
    }

    return leadingComments &&
        leadingComments.length &&
        leadingComments.every(comment => comment.type === 'CommentBlock');
}

export function markProcessed(path) {
    Object.defineProperty(path, '__jsdoc_to_assert_checked__', {
        enumerable: false,
        value: true
    });
}

export function isProcessed(path) {
    return path.__jsdoc_to_assert_checked__;
}

export function getLocation(path, state) {
    let filename = getFilename(state),
        {start} = path.node.loc;

    return basename(filename) + `:${start.line}:${start.column}`;
}

function getFilename(state) {
    return state.file.opts.filename;
}
