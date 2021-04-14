import cloneDeep from 'lodash/fp/cloneDeep';
const sourceDescription = {
  ...cloneDeep(ASTREAM),
  statistics: 'myTestStats',
  errorStats: 'my Error Stats',
};
