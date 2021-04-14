const assert = require('assert');
const range = require('lodash/fp/range');
const {
  FIXED_ARITY_OF_ONE,
  FIXED_ARITY_OF_TWO,
  FIXED_ARITY_OF_THREE,
  ORDERS,
  ALL_METHODS,
  reorderArgs,
} = require('../reorder-args');

const _ = require('lodash');

test.each(Object.entries(ORDERS))('should reorder %s %s', (key, cycle) => {
  const args = range(0, cycle.length);
  const { args: reordered } = reorderArgs(key, args);

  reordered.forEach((val, idx) => {
    expect(val).toEqual(args[cycle[idx]]);
  });
});
