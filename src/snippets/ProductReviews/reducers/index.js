import { combineReducers } from 'redux';
import common from './common';
import data from './data';

const reducers = combineReducers({
  common,
  data,
});

// flow
// export type StoreTypes = ReturnType<typeof reducers>;

export default reducers;
