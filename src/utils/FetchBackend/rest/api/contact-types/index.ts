import FetchBackend from '../../..';
import HttpException from '../../../HttpException';
import GetContactTypeDto from './dto/get-contact-type.dto';

export default class FetchContactTypes {
  static async get() {
    const result = await FetchBackend('none', 'GET', 'contact-types');
    const response = result.response;

    if (response.status === 200) {
      const json: GetContactTypeDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
