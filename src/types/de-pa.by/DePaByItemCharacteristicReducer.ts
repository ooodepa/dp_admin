import { ItemCharacteristicWithIdDto } from './api/v1/item-characteristics/item-characteristics.dto';

export interface DePaByItemCharacteristicState {
  itemCharacteristics: {
    data: ItemCharacteristicWithIdDto[];
    isLoading: boolean;
    error: string | null;
  };
  itemCharacteristic: {
    data: ItemCharacteristicWithIdDto;
    isLoading: boolean;
    isNotFound: boolean;
    error: string | null;
  };
}

export enum DePaByItemCharacteristicsTypes {
  FETCH_DEPABY_ITEM_CHARACTERISTICS = 'FETCH_DEPABY_ITEM_CHARACTERISTICS',
  FETCH_DEPABY_ITEM_CHARACTERISTICS_SUCCESS = 'FETCH_DEPABY_ITEM_CHARACTERISTICS_SUCCESS',
  FETCH_DEPABY_ITEM_CHARACTERISTICS_LOADING = 'FETCH_DEPABY_ITEM_CHARACTERISTICS_LOADING',
  FETCH_DEPABY_ITEM_CHARACTERISTICS_ERROR = 'FETCH_DEPABY_ITEM_CHARACTERISTICS_ERROR',
  FETCH_DEPABY_ITEM_CHARACTERISTIC = 'FETCH_DEPABY_ITEM_CHARACTERISTIC',
  FETCH_DEPABY_ITEM_CHARACTERISTIC_SUCCESS = 'FETCH_DEPABY_ITEM_CHARACTERISTIC_SUCCESS',
  FETCH_DEPABY_ITEM_CHARACTERISTIC_LOADING = 'FETCH_DEPABY_ITEM_CHARACTERISTIC_LOADING',
  FETCH_DEPABY_ITEM_CHARACTERISTIC_NOT_FOUND = 'FETCH_DEPABY_ITEM_CHARACTERISTIC_NOT_FOUND',
  FETCH_DEPABY_ITEM_CHARACTERISTIC_ERROR = 'FETCH_DEPABY_ITEM_CHARACTERISTIC_ERROR',
}

interface DePaByItemCharacteristics {
  type: DePaByItemCharacteristicsTypes.FETCH_DEPABY_ITEM_CHARACTERISTICS;
}

interface DePaByItemCharacteristicsSuccess {
  type: DePaByItemCharacteristicsTypes.FETCH_DEPABY_ITEM_CHARACTERISTICS_SUCCESS;
  payload: ItemCharacteristicWithIdDto[];
}

interface DePaByItemCharacteristicsLoading {
  type: DePaByItemCharacteristicsTypes.FETCH_DEPABY_ITEM_CHARACTERISTICS_LOADING;
}

interface DePaByItemCharacteristicsError {
  type: DePaByItemCharacteristicsTypes.FETCH_DEPABY_ITEM_CHARACTERISTICS_ERROR;
  payload: string;
}

interface DePaByItemCharacteristic {
  type: DePaByItemCharacteristicsTypes.FETCH_DEPABY_ITEM_CHARACTERISTIC;
}

interface DePaByItemCharacteristicSuccess {
  type: DePaByItemCharacteristicsTypes.FETCH_DEPABY_ITEM_CHARACTERISTIC_SUCCESS;
  payload: ItemCharacteristicWithIdDto;
}

interface DePaByItemCharacteristicLoading {
  type: DePaByItemCharacteristicsTypes.FETCH_DEPABY_ITEM_CHARACTERISTIC_LOADING;
}

interface DePaByItemCharacteristicNotFound {
  type: DePaByItemCharacteristicsTypes.FETCH_DEPABY_ITEM_CHARACTERISTIC_NOT_FOUND;
}

interface DePaByItemCharacteristicError {
  type: DePaByItemCharacteristicsTypes.FETCH_DEPABY_ITEM_CHARACTERISTIC_ERROR;
  payload: string;
}

export type DePaByItemAction =
  | DePaByItemCharacteristics
  | DePaByItemCharacteristicsSuccess
  | DePaByItemCharacteristicsLoading
  | DePaByItemCharacteristicsError
  | DePaByItemCharacteristic
  | DePaByItemCharacteristicSuccess
  | DePaByItemCharacteristicLoading
  | DePaByItemCharacteristicNotFound
  | DePaByItemCharacteristicError;
