import { thunk } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { LogicLikeState } from '../types/logiclike.com/logiclikeReducer';
import { DePaByItemState } from '../types/de-pa.by/DePaByItemReducer';

export interface RootStoreDto {
  logiclikeReducer: LogicLikeState;
  DePaByItemReducer: DePaByItemState;
}

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk), // Включаем Thunk Middleware в список middleware
});
