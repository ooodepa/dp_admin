import FetchBackend from '../../..';
import HttpException from '../../../HttpException';
import GetItemCategoryDto from './dto/get-item-category.dto';

export default class FetchItemCategories {
  static async get() {
    const result = await FetchBackend('none', 'GET', 'item-categories');
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemCategoryDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async filterByBrand(brand: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `item-categories?brand=${brand}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemCategoryDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async filterOneByUrl(url: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `item-categories/filter-one/url/${url}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemCategoryDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }
}
