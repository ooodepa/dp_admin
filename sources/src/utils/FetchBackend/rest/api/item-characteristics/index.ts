import FetchBackend from '../../..';
import HttpException from '../../../HttpException';
import GetItemCharacteristicDto from './dto/get-item-characteristic.dto';

export default class FetchItemCharacteristics {
  static async get() {
    const result = await FetchBackend('none', 'GET', 'item-characteristics');
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemCharacteristicDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
