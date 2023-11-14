import FetchBackend from '../../..';
import HttpException from '../../../HttpException';
import GetHelperDto from './dto/get-helper.dto';

export default class FetchHelpers {
  static async get() {
    const result = await FetchBackend('none', 'GET', 'helpers');
    const response = result.response;

    if (response.status === 200) {
      const json: GetHelperDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
