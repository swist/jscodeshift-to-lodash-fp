const difference = require('lodash/fp/difference');
const concat = require('lodash/fp/concat');
const fs = require('fs');

const CUSTOM_ORDERS = {
  assignInAllWith: [1, 0],
  assignInWith: [2, 0, 1],
  assignAllWith: [1, 0],
  assignWith: [2, 0, 1],
  differenceBy: [2, 0, 1],
  differenceWith: [2, 0, 1],
  getOr: [2, 1, 0],
  intersectionBy: [2, 0, 1],
  intersectionWith: [2, 0, 1],
  isEqualWith: [2, 0, 1],
  isMatchWith: [2, 1, 0],
  mergeAllWith: [1, 0],
  mergeWith: [2, 0, 1],
  padChars: [2, 1, 0],
  padCharsEnd: [2, 1, 0],
  padCharsStart: [2, 1, 0],
  pullAllBy: [2, 1, 0],
  pullAllWith: [2, 1, 0],
  rangeStep: [2, 0, 1],
  rangeStepRight: [2, 0, 1],
  setWith: [3, 1, 2, 0],
  sortedIndexBy: [2, 1, 0],
  sortedLastIndexBy: [2, 1, 0],
  unionBy: [2, 0, 1],
  unionWith: [2, 0, 1],
  updateWith: [3, 1, 2, 0],
  xorBy: [2, 0, 1],
  xorWith: [2, 0, 1],
  zipWith: [2, 0, 1],
};

const loadArityFile = filename => {
  return new Set(
    difference(fs.readFileSync(filename).toString().split('\n'), Object.keys(CUSTOM_ORDERS))
  );
};

const FIXED_ARITY_OF_ONE = loadArityFile('./FIXED_ARITY_OF_ONE.txt');
const FIXED_ARITY_OF_TWO = loadArityFile('./FIXED_ARITY_OF_TWO.txt');
const FIXED_ARITY_OF_THREE = loadArityFile('./FIXED_ARITY_OF_THREE.txt');

const rotateArgsByCycle = (cycle, args) => {
  if (cycle.length !== args.length) {
    throw new Error('you are trying to reorder args shorter than the length');
  }
  return cycle.map(idx => args[idx]);
};

const reorderArgs = (name, args) => {
  if (CUSTOM_ORDERS[name]?.length) {
    return rotateArgsByCycle(CUSTOM_ORDERS[name], args);
  }
  if (FIXED_ARITY_OF_ONE.has(name)) {
    return args;
  }
  if (FIXED_ARITY_OF_TWO.has(name)) {
    return rotateArgsByCycle([1, 0], args);
  }
  if (FIXED_ARITY_OF_THREE.has(name)) {
    return rotateArgsByCycle([1, 2, 0], args);
  }
};

module.exports = {
  FIXED_ARITY_OF_ONE,
  FIXED_ARITY_OF_TWO,
  FIXED_ARITY_OF_THREE,
  CUSTOM_ORDERS,
  reorderArgs,
  ALL_METHODS: concat(
    Object.keys(CUSTOM_ORDERS),
    FIXED_ARITY_OF_ONE,
    FIXED_ARITY_OF_TWO,
    FIXED_ARITY_OF_THREE
  ),
};
