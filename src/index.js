// @flow
import {parseComment} from 'jsdoc-to-condition'
import {getLocation, isProcessed, markProcessed, validate} from './util';
import {generateAssert} from './generators';
import {flatten} from 'lodash';
import {BabelPath, Types} from './babel-types';

type PluginOptions = {
    mode?: string,
    logger?: string
}

export default function ({types: t, template}: { types: Types }) {

    function injectParameterAssert(path: BabelPath, leadingComments, state) {
        if (isProcessed(path) || !validate(leadingComments, state)) {
            return;
        }

        markProcessed(path);

        let bindings = {};

        path.node.params.forEach(param => {
            if (param.name !== param.loc.identifierName) {
                bindings[param.loc.identifierName] = param.name;
            }
        });

        let comments = leadingComments.map(comment => `/*${comment.value}*/`),
            items = flatten(comments.map(comment => parseComment(comment, {unwrap: true, bindings})));

        if (!items.length || !path.node.loc) {
            return;
        }

        let asserts = [],
            location = getLocation(path, state),
            bodyPath = path.get('body');

        items.forEach(item => {
            let {name, binding} = item.tag,
                varBinding = binding.split('.')[0];

           if (!bodyPath.scope.hasBinding(varBinding)) {
                throw new Error(`${location}: Parameter ${binding} described in JSDoc doesn't exist`);
            }

            asserts.push(generateAssert({
                name,
                binding,
                validation: item.validation,
                tag: item.tag,
                options: state.opts,
                location
            }));
        });

        let ast = template(asserts.join('\n'))();
        path.get('body').unshiftContainer('body', ast);
    }

    return {
        visitor: {
            ['ObjectMethod|ClassMethod|FunctionDeclaration|FunctionExpression|ArrowFunctionExpression']: {
                enter(path) {
                    let leadingComments,
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
            }
        }
    };
}
