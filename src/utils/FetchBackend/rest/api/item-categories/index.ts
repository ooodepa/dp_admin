import FetchBackend from '../../..';
import HttpException from '../../../HttpException';
import HttpResponseDto from '../../../dto/http-response.dto';
import GetItemCategoryDto from './dto/get-item-category.dto';
import CreateItemCategoryDto from './dto/create-item-brand.dto';
import UpdateItemCategoryDto from './dto/update-item-category.dto';
import ItemCategoryDto from './dto/item-category.dto';

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

  static async getById(id: number) {
    const result = await FetchBackend('none', 'GET', `item-categories/${id}`);
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemCategoryDto = await response.json();
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

  static async update(id: number, dto: UpdateItemCategoryDto) {
    const result = await FetchBackend(
      'access',
      'PATCH',
      `item-categories/${id}`,
      dto,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: HttpResponseDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async updateBulk(dto: ItemCategoryDto[]) {
    const obj = { bulk: dto };
    const result = await FetchBackend('access', 'PUT', 'item-categories/bulk', obj);
    const response = result.response;

    if (response.status === 200) {
      return true;
    }

    throw new HttpException(result.method, response);
  }

  static async create(dto: CreateItemCategoryDto) {
    const result = await FetchBackend('access', 'POST', 'item-categories', dto);
    const response = result.response;

    if (response.status === 201) {
      const json: HttpResponseDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async createBulk(dto: ItemCategoryDto[]) {
    const obj = { bulk: dto };
    const result = await FetchBackend('access', 'POST', 'item-categories/bulk', obj);
    const response = result.response;

    if (response.status === 201) {
      return true;
    }

    throw new HttpException(result.method, response);
  }

  static async remove(id: number) {
    const result = await FetchBackend(
      'access',
      'DELETE',
      `item-categories/${id}`,
    );
    const response = result.response;

    if (response.status === 200) {
      return true;
    }

    throw new HttpException(result.method, response);
  }
}
