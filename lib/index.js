'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var t = _ref.types,
        template = _ref.template;


    // function injectTypeAssert(declarationsPath, identifierName, leadingComments, state) {
    //     let Generator = getGenerator(options.generator, state);
    //
    //     let
    // asserts = leadingComments.reduce((asserts, comment) => {
    //         return asserts.concat(CommentConverter.toTypeAsserts(identifierName, comment, {Generator}));
    //     }, []);
    //
    //     if (asserts.length) {
    //         let functionDeclarationString = trimSpaceEachLine(asserts).join('\n');
    //         let builtAssert = template(functionDeclarationString)();
    //         if (builtAssert) {
    //             declarationsPath.insertAfter(builtAssert);
    //         }
    //     }
    // }

    function injectParameterAssert(path, leadingComments, state) {
        if ((0, _util.isProcessed)(path) || !(0, _util.validate)(leadingComments, state)) {
            return;
        }

        (0, _util.markProcessed)(path);

        var comments = leadingComments.map(function (comment) {
            return '/*' + comment.value + '*/';
        }),
            items = (0, _lodash.flatten)(comments.map(function (comment) {
            return (0, _jsdocToCondition.parseComment)(comment, { unwrap: true });
        }));

        if (!items.length || !path.node.loc) {
            return;
        }

        var asserts = [],
            assertedBindings = [],
            location = (0, _util.getLocation)(path, state),
            bodyPath = path.get('body');

        items.forEach(function (item) {
            var name = item.tag.name,
                binding = String(name).replace(/\..*$/, ''),
                asserted = assertedBindings.includes(binding);


            assertedBindings.push(binding);

            if (!asserted && !hasBinding(bodyPath.scope, path.node.params, binding)) {
                throw new Error(location + ': Parameter ' + binding + ' described in JSDoc doesn\'t exist');
            } else {
                asserts.push((0, _generators.generateAssert)({
                    validation: item.validation,
                    tag: item.tag,
                    options: state.opts,
                    location: location
                }));
            }
        });

        var ast = template(asserts.join('\n'))();
        path.get('body').unshiftContainer('body', ast);
    }

    return {
        visitor: _defineProperty({}, 'ObjectMethod|ClassMethod|FunctionDeclaration|FunctionExpression|ArrowFunctionExpression', {
            enter: function enter(path) {
                var leadingComments = void 0,
                    node = path.node,
                    parentNode = path.parentPath && path.parentPath.node,
                    parentParentNode = parentNode && path.parentPath.parentPath && path.parentPath.parentPath.node;

                if (t.isExportNamedDeclaration(parentNode) || t.isExportDefaultDeclaration(parentNode)) {
                    leadingComments = parentNode.leadingComments;
                } else if (t.isObjectProperty(parentNode)) {
                    leadingComments = parentNode.leadingComments;
                } else if (t.isVariableDeclarator(parentNode) && t.isVariableDeclaration(parentParentNode)) {
                    leadingComments = parentParentNode.leadingComments;
                } else if (t.isAssignmentExpression(parentNode) && t.isExpressionStatement(parentParentNode)) {
                    leadingComments = parentParentNode.leadingComments;
                } else if (t.isObjectMethod(node) || t.isClassMethod(node) || t.isFunctionDeclaration(node)) {
                    leadingComments = node.leadingComments;
                }

                injectParameterAssert(path, leadingComments, this);
            }
        })
    };
};

var _jsdocToCondition = require('jsdoc-to-condition');

var _util = require('./util');

var _generators = require('./generators');

var _lodash = require('lodash');

var _babelTypes = require('./babel-types');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// `comment` node contains @type, return true
function containsTypeComment(comment) {
    return comment ? false : /@type/.test(comment.value);
}

function hasBinding(scope) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var name = arguments[2];

    return scope.hasBinding(name) || params.find(function (param) {
        return param.loc.identifierName === name;
    });
}

module.exports = exports['default'];
//# sourceMappingURL=index.js.map