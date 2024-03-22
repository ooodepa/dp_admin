import { combineReducers } from 'redux';
import { logiclikeReducer } from './logiclikeReducer';

export const rootReducer = combineReducers({
  logiclikeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
