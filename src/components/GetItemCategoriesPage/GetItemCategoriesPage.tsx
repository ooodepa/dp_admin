import * as xlsx from 'xlsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppModal from '../AppModal/AppModal';
import TableView from '../TableView/TableView';
import FetchUsers from '../../utils/FetchBackend/rest/api/users';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';
import FetchItemCategories from '../../utils/FetchBackend/rest/api/item-categories';
import BrowserDownloadFileController from '../../package/BrowserDownloadFileController';
import GetItemCategoryDto from '../../utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';

export default function GetItemCategoriesPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(<></>);
  const [categories, setCategories] = useState<GetItemCategoryDto[]>([]);

  async function getDataFromDatabase() {
    try {
      await FetchUsers.isAdmin();

      const itemCategories = (await FetchItemCategories.get())
        .sort((a, b) => a.dp_sortingIndex - b.dp_sortingIndex)
        .sort((a, b) => a.dp_itemBrandId - b.dp_itemBrandId);
      setCategories(itemCategories);
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  function preToDelete(id: number) {
    setModal(
      <AppModal
        title="Удаление элемента"
        message={`Вы уверены, что хотите удалить эелемент под id = ${id}?`}>
        <button onClick={() => toDelete(id)}>Удалить</button>
        <button onClick={() => setModal(<></>)}>Не удалять</button>
      </AppModal>,
    );
  }

  async function toDelete(id: number) {
    try {
      setModal(<></>);

      await FetchItemCategories.remove(id);

      const itemCategories = (await FetchItemCategories.get())
        .sort((a, b) => a.dp_sortingIndex - b.dp_sortingIndex)
        .sort((a, b) => a.dp_itemBrandId - b.dp_itemBrandId);
      setCategories(itemCategories);
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  function saveAsJson() {
    const filename = 'DP_CTL_ItemCategories.json';
    const text = JSON.stringify(categories, null, 2);
    BrowserDownloadFileController.downloadFile(filename, text);
  }

  async function saveItemsAsXlsx() {
    try {
      const headers = [
        'id',
        'КодКатегории',
        'Сортировка',
        'Наименование',
        'Картинка',
        'Ссылка',
        'Ключевые слова',
        'Описание',
        'Скрыт',
      ];

      const setBrandId: Set<number> = new Set();
      categories.forEach(e => {
        setBrandId.add(e.dp_itemBrandId);
      });

      const arrayBrandId = Array.from(setBrandId).sort((a, b) => a - b);

      const workbook = xlsx.utils.book_new();
      for (let i = 0; i < arrayBrandId.length; ++i) {
        const brandId = arrayBrandId[i];

        const arr = categories
          .filter(category => category.dp_itemBrandId === brandId)
          .sort((a, b) => a.dp_sortingIndex - b.dp_sortingIndex);

        const data: string[][] = [];

        for (let j = 0; j < arr.length; ++j) {
          const category = arr[j];
          data.push([
            `${category.dp_id}`,
            `${category.dp_itemBrandId}`,
            `${category.dp_sortingIndex}`,
            category.dp_seoTitle,
            category.dp_photoUrl,
            category.dp_seoUrlSegment,
            category.dp_seoKeywords,
            category.dp_seoDescription,
            category.dp_isHidden ? '1' : '0',
          ]);
        }

        const worksheet = xlsx.utils.aoa_to_sheet([headers, ...data]);
        xlsx.utils.book_append_sheet(workbook, worksheet, `${brandId}`);
      }

      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      const filename = 'DP_CTL_Item-categories.xlsx';
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      BrowserDownloadFileController.downloadFileByBlob(filename, blob);
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  return (
    <TableView
      side={
        <>
          <button onClick={getDataFromDatabase}>Загрузить данные из БД</button>
          <button onClick={() => navigate('new/create')}>Создать новый</button>
          <button onClick={() => navigate('open')}>Открыть файл</button>
          <button onClick={saveAsJson}>Скачать как JSON</button>
          <button onClick={saveItemsAsXlsx}>Скачать как XLSX</button>
        </>
      }>
      {modal}
      <table>
        <thead>
          <tr>
            <td>id</td>
            <td>
              Индекс для
              <br />
              cортировки
            </td>
            <td>Картинка</td>
            <td>Наименование</td>
            <td>URL</td>
            <td>Обновить</td>
            <td>Удалить</td>
          </tr>
        </thead>
        <tbody>
          {categories.map(e => {
            return (
              <tr key={e.dp_id}>
                <td>{e.dp_id}</td>
                <td>{e.dp_sortingIndex}</td>
                <td>
                  {!e.dp_photoUrl ? 'нет' : <img src={e.dp_photoUrl} alt="x" />}
                </td>
                <td>{e.dp_seoTitle}</td>
                <td>{e.dp_seoUrlSegment}</td>
                <td>
                  <button onClick={() => navigate(`${e.dp_id}`)}>
                    Обновить
                  </button>
                </td>
                <td>
                  <button onClick={() => preToDelete(e.dp_id)}>удалить</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableView>
  );
}
