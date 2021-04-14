jest.autoMockOff();
const { defineTest } = require('jscodeshift/dist/testUtils');
const fs = require('fs');
const path = require('path');
const uniq = require('lodash/fp/uniq');
const toFixtureName = p => p.replace('.js', '').replace('.input', '').replace('.output', '');

const files = fs.readdirSync(path.join(__dirname, '../__testfixtures__')).map(toFixtureName);

uniq(files).map(f => defineTest(__dirname, 'reorder-lodash-fp-args', null, f));
