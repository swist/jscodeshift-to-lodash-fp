const assert = require('assert');
const range = require('lodash/fp/range');
const {
  FIXED_ARITY_OF_ONE,
  FIXED_ARITY_OF_TWO,
  FIXED_ARITY_OF_THREE,

  CUSTOM_ORDERS,
  reorderArgs,
} = require('./reorder-args');

test.each(Object.entries(CUSTOM_ORDERS))('should reorder %s %s', (key, cycle) => {
  const args = range(0, cycle.length);
  const reordered = reorderArgs(key, args);

  reordered.forEach((val, idx) => {
    expect(val).toEqual(args[cycle[idx]]);
  });
});

test.each(Array.from(FIXED_ARITY_OF_ONE))('should not reorder %s', key => {
  expect(reorderArgs(key, [0])).toEqual([0]);
});

test.each(Array.from(FIXED_ARITY_OF_TWO))('should reorder %s [1,0]', key => {
  const cycle = [1, 0];
  const args = range(0, cycle.length);
  reorderArgs(key, args).forEach((val, idx) => {
    expect(val).toEqual(args[cycle[idx]]);
  });
});

test.each(Array.from(FIXED_ARITY_OF_THREE))('should not reorder %s, [1,2,0]', key => {
  const cycle = [1, 2, 0];
  const args = range(0, cycle.length);
  reorderArgs(key, args).forEach((val, idx) => {
    expect(val).toEqual(args[cycle[idx]]);
  });
});
