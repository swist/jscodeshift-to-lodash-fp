import { cloneDeep } from 'lodash';
const sourceDescription = {
  ...cloneDeep(ASTREAM),
  statistics: 'myTestStats',
  errorStats: 'my Error Stats',
};
