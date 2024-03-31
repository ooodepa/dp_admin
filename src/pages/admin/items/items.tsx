import * as xlsx from 'xlsx';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import AppModal from '../../../components/AppModal/AppModal';
import TableView from '../../../components/TableView/TableView';
import FetchUsers from '../../../utils/FetchBackend/rest/api/users';
import FetchItems from '../../../utils/FetchBackend/rest/api/items';
import FetchItemBrand from '../../../utils/FetchBackend/rest/api/item-brands';
import GetItemDto from '../../../utils/FetchBackend/rest/api/items/dto/get-item.dto';
import FetchItemCategories from '../../../utils/FetchBackend/rest/api/item-categories';
import BrowserDownloadFileController from '../../../package/BrowserDownloadFileController';
import FetchItemCharacteristics from '../../../utils/FetchBackend/rest/api/item-characteristics';
import GetItemBrandDto from '../../../utils/FetchBackend/rest/api/item-brands/dto/get-item-brand.dto';
import AlertExceptionHelper, {
  AsyncAlertExceptionHelper,
} from '../../../utils/AlertExceptionHelper';
import GetItemCategoryDto from '../../../utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';

export default function GetItemsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [modal, setModal] = useState(<></>);
  const [copyItems, setCopyItems] = useState<GetItemDto[]>([]);
  const [filtredCategories, setFiltredCategories] = useState<
    GetItemCategoryDto[]
  >([]);

  const [brands, setBrands] = useState<GetItemBrandDto[]>([]);
  const [categories, setCategories] = useState<GetItemCategoryDto[]>([]);
  const [items, setItems] = useState<GetItemDto[]>([]);

  useEffect(() => {
    (async function () {
      try {
        await FetchUsers.isAdmin();

        const result_items = await getItems();
        setCopyItems(result_items);
        setItems(result_items);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception, navigate);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    let queryParams: Record<string, string> = {};
    searchParams.forEach((value: string, key: string) => {
      queryParams[key] = value;
    });
    const SEARCH_PARAMS = queryParams;

    let result_items: GetItemDto[] = copyItems;

    const categoryId = SEARCH_PARAMS['categoryId'];
    const model = SEARCH_PARAMS['model'];
    const brandId = SEARCH_PARAMS['brandId'];
    const name = SEARCH_PARAMS['name'];
    const sortBy = SEARCH_PARAMS['sortBy'];
    const limit = SEARCH_PARAMS['limit'];
    const isReverseSort = SEARCH_PARAMS['isReverseSort'];

    if (brandId) {
      const numberBrandId = Number(brandId);

      const filtCategories = categories.filter(
        object => object.dp_itemBrandId === numberBrandId,
      );
      setFiltredCategories(filtCategories);

      if (
        categoryId &&
        !filtCategories
          .map(object => object.dp_itemBrandId)
          .includes(numberBrandId)
      ) {
        let params = getSearchParams();
        delete params['categoryId'];
        setSearchParams(params);
        console.log('return');
        return;
      }

      const categoriesIds = categories
        .filter(object => object.dp_itemBrandId === numberBrandId)
        .map(object => object.dp_id);
      result_items = result_items.filter(object =>
        categoriesIds.includes(object.dp_itemCategoryId),
      );
    }

    if (categoryId) {
      let numberCategoryId = Number(categoryId);
      result_items = result_items.filter(
        object => object.dp_itemCategoryId === numberCategoryId,
      );
    }

    if (model) {
      result_items = result_items.filter(object => {
        const regex = new RegExp(`.*${model}.*`);
        return regex.test(object.dp_seoUrlSegment);
      });
    }

    if (name) {
      result_items = result_items.filter(object => {
        const regex = new RegExp(`.*${name}.*`);
        return regex.test(object.dp_seoTitle);
      });
    }

    if (sortBy) {
      if (isReverseSort === '1') {
        switch (sortBy) {
          case 'name':
            result_items = result_items.sort((a, b) =>
              b.dp_seoTitle.localeCompare(a.dp_seoTitle),
            );
            break;
          case 'model':
            result_items = result_items.sort((a, b) =>
              b.dp_seoUrlSegment.localeCompare(a.dp_seoUrlSegment),
            );
            break;
          case 'categoryId':
            result_items = result_items.sort(
              (a, b) => b.dp_itemCategoryId - a.dp_itemCategoryId,
            );
            break;
          case 'cost':
            result_items = result_items.sort((a, b) => b.dp_cost - a.dp_cost);
            break;
        }
      }
      if (isReverseSort !== '1') {
        switch (sortBy) {
          case 'name':
            result_items = result_items.sort((a, b) =>
              a.dp_seoTitle.localeCompare(b.dp_seoTitle),
            );
            break;
          case 'model':
            result_items = result_items.sort((a, b) =>
              a.dp_seoUrlSegment.localeCompare(b.dp_seoUrlSegment),
            );
            break;
          case 'categoryId':
            result_items = result_items.sort(
              (a, b) => a.dp_itemCategoryId - b.dp_itemCategoryId,
            );
            break;
          case 'cost':
            result_items = result_items.sort((a, b) => a.dp_cost - b.dp_cost);
            break;
        }
      }
    }

    if (limit) {
      const numberLimit = Number(limit);
      result_items = result_items.slice(0, numberLimit);
    }

    console.log(`Показано ${result_items.length}/${copyItems.length}`);
    setItems(result_items);
  }, [categories, copyItems, searchParams]);

  function getSearchParams() {
    let queryParams: Record<string, string> = {};
    searchParams.forEach((value: string, key: string) => {
      queryParams[key] = value;
    });

    return queryParams;
  }

  async function getItems() {
    const array_brands = (await FetchItemBrand.get()).sort(
      (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
    );
    const array_categories = (await FetchItemCategories.get()).sort(
      (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
    );
    const array_items = (await FetchItems.get()).sort((a, b) =>
      a.dp_seoUrlSegment.localeCompare(b.dp_seoUrlSegment),
    );

    const result_array_items: GetItemDto[] = [];
    array_brands.forEach(brand => {
      array_categories.forEach(category => {
        if (brand.dp_id === category.dp_itemBrandId) {
          array_items.forEach(item => {
            if (category.dp_id === item.dp_itemCategoryId) {
              const ch = item.dp_itemCharacteristics
                .sort((a, b) => a.dp_id - b.dp_id)
                .sort((a, b) => a.dp_characteristicId - b.dp_characteristicId);
              result_array_items.push({
                ...item,
                dp_itemCharacteristics: ch,
              });
            }
          });
        }
      });
    });

    setBrands(array_brands);
    setCategories(array_categories);
    setFiltredCategories(array_categories);
    setItems(result_array_items);

    return result_array_items;
  }

  function saveAsJson() {
    try {
      const filename = 'DP_CTL_Items.json';
      const text = JSON.stringify(items, null, 2);
      BrowserDownloadFileController.downloadFile(filename, text);
    } catch (exception) {
      AlertExceptionHelper(exception);
    }
  }

  async function saveItemsAsXlsx() {
    try {
      const characteristics = (await FetchItemCharacteristics.get()).sort(
        (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
      );

      const headers = [
        'id',
        'Наименование',
        'Модель',
        'Цена',
        'Это папка',
        'Родитель',
        'Индекс сортировки',
        'Характеристики',
        'ОптКоличество',
        'Бренд',
        'Имя для объединения карточки',
        'Скрыт',
        'Валюта',
        '1С код',
        '1С наименование',
        'Картинки',
        'Картинки 360',
        'Длина',
        'Ширина',
        'Высота',
        'Вес',
        'Штрихкоды',
        'YT',
        'Артикулы',
        'Картинка',
        'Ключевые слова',
        'Описание',
        'Код категории',
        'Галерея',
        ...characteristics.map(e => e.dp_name),
      ];

      const setCategoriesId: Set<number> = new Set();
      for (let i = 0; i < items.length; ++i) {
        setCategoriesId.add(items[i].dp_itemCategoryId);
      }

      const arrayCategoriesId = Array.from(setCategoriesId).sort(
        (a, b) => a - b,
      );

      const workbook = xlsx.utils.book_new();

      const allDataArray: string[][] = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        allDataArray.push([
          item.dp_id,
          item.dp_seoTitle,
          item.dp_seoUrlSegment,
          `${item.dp_cost}`,
          item.dp_1cIsFolder ? '1' : '0',
          item.dp_1cParentId,
          '' + item.dp_sortingIndex,
          item.dp_textCharacteristics,
          '' + item.dp_wholesaleQuantity,
          item.dp_brand,
          item.dp_combinedName,
          item.dp_isHidden ? '1' : '0',
          item.dp_currancy,
          item.dp_1cCode,
          item.dp_1cDescription,
          item.dp_photos,
          item.dp_photos360,
          '' + item.dp_width,
          '' + item.dp_length,
          '' + item.dp_height,
          '' + item.dp_weight,
          item.dp_barcodes,
          item.dp_youtubeIds,
          item.dp_vendorIds,
          item.dp_photoUrl,
          item.dp_seoKeywords,
          item.dp_seoDescription,
          `${item.dp_itemCategoryId}`,
          item.dp_itemGalery.map(e => e.dp_photoUrl).join(' '),
          ...characteristics.map(
            e =>
              item.dp_itemCharacteristics.find(
                j => e.dp_id === j.dp_characteristicId,
              )?.dp_value || '',
          ),
        ]);
      }

      const worksheetAll = xlsx.utils.aoa_to_sheet([headers, ...allDataArray]);
      xlsx.utils.book_append_sheet(workbook, worksheetAll, 'ALL');

      for (let i = 0; i < arrayCategoriesId.length; ++i) {
        const categoryId = arrayCategoriesId[i];

        const arr = items
          .filter(item => item.dp_itemCategoryId === categoryId)
          .sort((a, b) => a.dp_seoUrlSegment.localeCompare(b.dp_seoUrlSegment));

        const data: string[][] = [];

        for (let j = 0; j < arr.length; ++j) {
          const item = arr[j];
          data.push([
            item.dp_id,
            item.dp_seoTitle,
            item.dp_seoUrlSegment,
            `${item.dp_cost}`,
            item.dp_1cIsFolder ? '1' : '0',
            item.dp_1cParentId,
            '' + item.dp_sortingIndex,
            item.dp_textCharacteristics,
            '' + item.dp_wholesaleQuantity,
            item.dp_brand,
            item.dp_combinedName,
            item.dp_isHidden ? '1' : '0',
            item.dp_currancy,
            item.dp_1cCode,
            item.dp_1cDescription,
            item.dp_photos,
            item.dp_photos360,
            '' + item.dp_width,
            '' + item.dp_length,
            '' + item.dp_height,
            '' + item.dp_weight,
            item.dp_barcodes,
            item.dp_youtubeIds,
            item.dp_vendorIds,
            item.dp_photoUrl,
            item.dp_seoKeywords,
            item.dp_seoDescription,
            `${item.dp_itemCategoryId}`,
            item.dp_isHidden ? '1' : '0',
            item.dp_itemGalery.map(e => e.dp_photoUrl).join(' '),
            ...characteristics.map(
              e =>
                item.dp_itemCharacteristics.find(
                  j => e.dp_id === j.dp_characteristicId,
                )?.dp_value || '',
            ),
          ]);
        }

        const worksheet = xlsx.utils.aoa_to_sheet([headers, ...data]);
        xlsx.utils.book_append_sheet(workbook, worksheet, `${categoryId}`);
      }

      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      const filename = 'DP_CTL_Items.xlsx';
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      BrowserDownloadFileController.downloadFileByBlob(filename, blob);
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  function preToDelete(id: string) {
    setModal(
      <AppModal
        title="Удаление элемента"
        message={`Вы уверены, что хотите удалить эелемент под id = ${id}?`}>
        <button onClick={() => toDelete(id)}>Удалить</button>
        <button onClick={() => setModal(<></>)}>Не удалять</button>
      </AppModal>,
    );
  }

  async function toDelete(id: string) {
    try {
      setModal(<></>);
      await FetchItems.remove(id);
      const itemsJson = await FetchItems.get();
      setItems(itemsJson);
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  return (
    <TableView
      side={
        <div>
          <button onClick={() => navigate('new')}>Создать новый элемент</button>
          <button onClick={() => navigate('open')}>Открыть XLSX</button>
          <button onClick={saveAsJson}>Скачать как JSON</button>
          <button onClick={saveItemsAsXlsx}>Скачать как XLSX</button>

          <ul>
            <li>
              <label htmlFor="filterByLimit">Показать записей</label>
              <input
                id="filterByLimit"
                type="number"
                min={0}
                value={searchParams.get('limit') || '100'}
                onChange={event =>
                  setSearchParams({
                    ...getSearchParams(),
                    limit: event.target.value,
                  })
                }
              />
            </li>
          </ul>
          <p>Фильтровать по полям:</p>
          <ul>
            <li>
              <label htmlFor="filterBrand">- бренд</label>
              <select id="filterBrand">
                <option
                  onClick={() =>
                    setSearchParams({
                      ...getSearchParams(),
                      brandId: '',
                    })
                  }>
                  Выберите бренд
                </option>
                {brands.map(brand => {
                  return (
                    <option
                      key={brand.dp_id}
                      onClick={() =>
                        setSearchParams({
                          ...getSearchParams(),
                          brandId: `${brand.dp_id}`,
                        })
                      }>
                      {`(${brand.dp_id}) - ${brand.dp_seoTitle}`}
                    </option>
                  );
                })}
              </select>
            </li>
            <li>
              <label htmlFor="filterCategoryId">- код категории</label>
              <select id="filterCategoryId">
                <option
                  onClick={() =>
                    setSearchParams({
                      ...getSearchParams(),
                      categoryId: '',
                    })
                  }>
                  Выберите категорию
                </option>
                {filtredCategories.map(category => {
                  return (
                    <option
                      key={category.dp_id}
                      onClick={() =>
                        setSearchParams({
                          ...getSearchParams(),
                          categoryId: `${category.dp_id}`,
                        })
                      }>{`(${category.dp_id}) - ${category.dp_seoTitle}`}</option>
                  );
                })}
              </select>
            </li>
            <li>
              <label htmlFor="filterName">- наименование</label>
              <input
                id="filterName"
                type="text"
                value={searchParams.get('itemName') || ''}
                onChange={event =>
                  setSearchParams({
                    ...getSearchParams(),
                    itemName: event.target.value,
                  })
                }
              />
            </li>
            <li>
              <label htmlFor="filterModel">- модель</label>
              <input
                id="filterModel"
                type="text"
                value={searchParams.get('model') || ''}
                onChange={event =>
                  setSearchParams({
                    ...getSearchParams(),
                    model: event.target.value,
                  })
                }
              />
            </li>
            <li>
              <p>Сортировка по полю:</p>
              <ul>
                <li>
                  <input
                    id="sortReverse"
                    type="checkbox"
                    checked={searchParams.get('isReverseSort') === '0'}
                    onChange={() =>
                      setSearchParams({
                        ...getSearchParams(),
                        isReverseSort:
                          searchParams.get('isReverseSort') === '0' ? '1' : '0',
                      })
                    }
                  />
                  <label htmlFor="sortReverse"></label>
                  <span title="Использовать обратную сортировку">
                    исп. обратную сорт.
                  </span>
                </li>
                <li>
                  <input
                    id="sortModel"
                    type="radio"
                    name="sort"
                    value={searchParams.get('sortBy') || '0'}
                    onChange={event =>
                      setSearchParams({ ...getSearchParams(), sortBy: 'model' })
                    }
                  />
                  <label htmlFor="sortModel">модель</label>
                </li>
                <li>
                  <input
                    id="sortName"
                    type="radio"
                    name="sort"
                    value={searchParams.get('sortBy') || '0'}
                    onChange={event =>
                      setSearchParams({ ...getSearchParams(), sortBy: 'name' })
                    }
                  />
                  <label htmlFor="sortName">наименование</label>
                </li>
                <li>
                  <input
                    id="sortCodeCategory"
                    type="radio"
                    name="sort"
                    value={searchParams.get('sortBy') || '0'}
                    onChange={event =>
                      setSearchParams({
                        ...getSearchParams(),
                        sortBy: 'categoryId',
                      })
                    }
                  />
                  <label htmlFor="sortCodeCategory">код категории</label>
                </li>
                <li>
                  <input
                    id="sortCost"
                    type="radio"
                    name="sort"
                    value={searchParams.get('sortBy') || '0'}
                    onChange={event =>
                      setSearchParams({ ...getSearchParams(), sortBy: 'cost' })
                    }
                  />
                  <label htmlFor="sortCost">цена</label>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      }>
      {modal}
      <table>
        <thead>
          <tr>
            <td></td>
            <td>id</td>
            <td>Картинка</td>
            <td>Модель</td>
            <td>Наименование</td>
            <td>Код категории</td>
            <td>Цена</td>
            <td>Обновить</td>
            <td>Удалить</td>
          </tr>
        </thead>
        <tbody>
          {items.map(e => {
            const uuid = e.dp_id;
            const firstCharsId = `${uuid}`.substring(0, 4);
            const lastCharsId = `${uuid}`.substring(32);

            const title = `id="${uuid}" - ${
              e.dp_isHidden ? 'isHidden=true' : 'isHidden=false'
            }`;

            return (
              <tr key={uuid} title={title}>
                <td>{e.dp_isHidden ? '*' : ''}</td>
                <td style={{ fontFamily: 'courier' }}>
                  {firstCharsId}...{lastCharsId}
                </td>
                <td>
                  {!e.dp_photoUrl ? 'нет' : <img src={e.dp_photoUrl} alt="x" />}
                </td>
                <td>{e.dp_seoUrlSegment}</td>
                <td>{e.dp_seoTitle}</td>
                <td>{e.dp_itemCategoryId}</td>
                <td>{Number(e.dp_cost).toFixed(2)}</td>
                <td>
                  <button onClick={() => navigate(`update/${e.dp_id}`)}>
                    Обновить
                  </button>
                </td>
                <td>
                  <button onClick={() => preToDelete(e.dp_id)}>Удалить</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableView>
  );
}
