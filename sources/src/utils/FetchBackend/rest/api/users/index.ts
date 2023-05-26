import FetchBackend from '../../..';
import HttpException from '../../../HttpException';

export default class FetchUsers {
  static async isAdmin() {
    const result = await FetchBackend('access', 'POST', 'users/is-admin');
    const response = result.response;

    if (response.status === 200) {
      return true;
    }

    if (response.status === 403) {
      return false;
    }

    throw new HttpException(result.method, response);
  }
}
