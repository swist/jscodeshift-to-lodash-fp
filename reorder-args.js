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
  range: [0,1]
};

const loadArityFile = arity => {
  return difference(require(`./arity-${arity}`), Object.keys(CUSTOM_ORDERS));
};

const FIXED_ARITY_OF_ZERO = loadArityFile(0);
const FIXED_ARITY_OF_ONE = loadArityFile(1);
const FIXED_ARITY_OF_TWO = loadArityFile(2);
const FIXED_ARITY_OF_THREE = loadArityFile(3);

const ORDERS = {
  ...Object.fromEntries(FIXED_ARITY_OF_ZERO.map(k => [k, []])),
  ...Object.fromEntries(FIXED_ARITY_OF_ONE.map(k => [k, [0]])),
  ...Object.fromEntries(FIXED_ARITY_OF_TWO.map(k => [k, [1, 0]])),
  ...Object.fromEntries(FIXED_ARITY_OF_THREE.map(k => [k, [1, 2, 0]])),
  ...CUSTOM_ORDERS,
};

const ALIASES = require('./aliases');

// TODO: pull this programmatically
const LONG_REPLACEMENTS = {
  get: 'getOr',
  range: 'rangeStep',
};
const SHORT_REPLACEMENTS = {
  orderBy: 'sortBy',
  flatMap: 'flatten',
};

class TooFewArgumentsError extends Error {}
class TooManyArgumentsError extends Error {}

// TODO: pull this from lodash docs
const EXTRAS = {
  times: ['identity'],
  every: ['identity'],
  sortBy: ['identity'],
};

const getExtraArgsForAlias = (alias, args) => {
  if (!ORDERS[alias] && !ALIASES[alias]) {
    return [];
  }
  const name = ALIASES[alias] || alias;
  const cycle = ORDERS[name];
  const extraArgs = args.length < cycle.length && EXTRAS[name];
  return extraArgs || [];
};

const reorderArgs = (name, args) => {
  if (!ORDERS[name] && !ALIASES[name]) {
    return { name, args };
  }
  const cycle = ORDERS[name] || ORDERS[ALIASES[name]];
  if (cycle.length === 0) {
    return { name, args };
  }
  if (cycle.length < args.length) {
    if (LONG_REPLACEMENTS[name]) {
      return reorderArgs(LONG_REPLACEMENTS[name], args);
    }

    throw new TooManyArgumentsError(`Old code has too many args for ${name}, ${args}`);
  } else if (cycle.length > args.length) {
    if (SHORT_REPLACEMENTS[name]) {
      return reorderArgs(SHORT_REPLACEMENTS[name], args);
    }

    throw new TooFewArgumentsError(`Old code has too few args for ${name}, ${args}`);
  }

  return { name, args: cycle.map(idx => args[idx]) };
};

module.exports = {
  FIXED_ARITY_OF_ONE,
  FIXED_ARITY_OF_TWO,
  FIXED_ARITY_OF_THREE,
  ORDERS,
  reorderArgs,
  getExtraArgsForAlias,
  TooFewArgumentsError,
  ALL_METHODS: concat(Object.keys(ORDERS), Object.keys(ALIASES)),
};
