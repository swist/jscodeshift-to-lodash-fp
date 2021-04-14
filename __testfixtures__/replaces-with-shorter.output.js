import orderBy from 'lodash/fp/orderBy';
import sortBy from 'lodash/fp/sortBy';
import rangeStep from 'lodash/fp/rangeStep';
sortBy('name', animals);
orderBy('name', ['desc'], animals);
rangeStep(3, 1, 2);
const cat = rangeStep(0.05, 0, 1);
