import test from 'ava';
import fs from 'fs';
import path from 'path';
import {transformFileSync} from 'babel-core';

function normalize(str) {
    return str.replace(/^\s+|\s+$/, '').replace(/\r?\n/g, '\n');
}

let fixturesDir = path.join(__dirname, 'fixtures');

fs.readdirSync(fixturesDir).map((caseName) => {
    test(`should generate assertions for ${caseName.replace(/-/g, ' ')}`, t => {
        let fixtureDir = path.join(fixturesDir, caseName);
        let actualPath = path.join(fixtureDir, 'actual.js');
        let actual = transformFileSync(actualPath).code;

        t.snapshot(actual);

        // if (path.sep === '\\') {
        //     // Specific case of windows, transformFileSync return code with '/'
        //     actualPath = actualPath.replace(/\\/g, '/');
        // }

        // const expected = fs.readFileSync(
        //     path.join(fixtureDir, 'expected.js')
        // ).toString().replace(/%FIXTURE_PATH%/g, actualPath);
        //
        // assert.equal(normalize(actual), normalize(expected));
    });
});
