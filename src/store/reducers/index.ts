import { combineReducers } from 'redux';
import { logiclikeReducer } from './logiclikeReducer';
import { DePaByItemReducer } from './DePaByItemReducer';

export const rootReducer = combineReducers({
  logiclikeReducer,
  DePaByItemReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
