import { thunk } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { LogicLikeState } from '../types/logiclike.com/logiclikeReducer';

export interface RootStoreDto {
  logiclikeReducer: LogicLikeState;
}

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk), // Включаем Thunk Middleware в список middleware
});
