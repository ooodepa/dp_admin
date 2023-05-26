import FetchBackend from '../../..';
import HttpException from '../../../HttpException';
import GetItemBrandDto from './dto/get-item-brand.dto';
import HttpResponseDto from '../../../dto/http-response.dto';
import CreateItemBrandDto from './dto/create-item-brand.dto';
import UpdateItemBrandDto from './dto/update-item-brand.dto';

export default class FetchItemBrand {
  static async get() {
    const result = await FetchBackend('none', 'GET', 'item-brands');
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemBrandDto[] = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async getById(id: number) {
    const result = await FetchBackend('none', 'GET', `item-brands/${id}`);
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemBrandDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async filterOneByUrl(url: string) {
    const result = await FetchBackend(
      'none',
      'GET',
      `item-brands/filter-one/url/${url}`,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: GetItemBrandDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async update(id: number, dto: UpdateItemBrandDto) {
    const result = await FetchBackend(
      'access',
      'PATCH',
      `item-brands/${id}`,
      dto,
    );
    const response = result.response;

    if (response.status === 200) {
      const json: HttpResponseDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async create(dto: CreateItemBrandDto) {
    const result = await FetchBackend('access', 'POST', 'item-brands', dto);
    const response = result.response;

    if (response.status === 201) {
      const json: HttpResponseDto = await response.json();
      return json;
    }

    throw new HttpException(result.method, response);
  }

  static async remove(id: number) {
    const result = await FetchBackend('access', 'DELETE', `item-brands/${id}`);
    const response = result.response;

    if (response.status === 200) {
      return true;
    }

    throw new HttpException(result.method, response);
  }
}
