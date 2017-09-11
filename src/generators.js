// @flow
import doctrine from 'doctrine';

export function generateAssert({name, binding, validation, location, tag, options: {mode, logger}}) {
    let type = doctrine.type.stringify(tag.type, {compact: true});

    let message = `'${location}: Expected \`${name}\` to have type ${type}, got: ' + (typeof ${binding})`;

    return `if (!${validation}) {${generateWarn({message, mode, logger})}}`;
}

function generateWarn({message, mode, logger}) {
    if (logger) {
        return logger + `(${message})`;
    } else {
        return (generators[mode] || generators.warn)({message})
    }
}

const generators = {
    warn: ({message}) => `
        console._warn(${message});
    `,
    debugger: ({message}) => `
        console.warn(${message});
        debugger;
    `,
    trace: ({message}) => `
        console.trace(${message});
    `,
    throw: ({message}) => `
        throw new Error(${message});
    `
};
