import test from 'ava';
import fs from 'fs';
import path from 'path';
import * as babelCore from 'babel-core';
import promisify from 'es6-promisify';

let transformFile = promisify(babelCore.transformFile);
let fixturesDir = path.join(__dirname, 'fixtures');
let readDir = promisify(fs.readdir);

readDir(fixturesDir).then(dirs => {
    dirs.forEach(caseName => {
        test(`should generate assertions for ${caseName.replace(/-/g, ' ')}`, async t => {
            let actualPath = path.join(fixturesDir, caseName, 'actual.js');
            let actual = await transformFile(actualPath, {
                'babelrc': false,
                'plugins': [
                    'transform-es2015-function-name',
                    require.resolve('../')
                ]
            });

            t.snapshot(actual.code);
        });
    });
});
