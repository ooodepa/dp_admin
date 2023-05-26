import * as xlsx from 'xlsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppModal from '../AppModal/AppModal';
import TableView from '../TableView/TableView';
import FetchUsers from '../../utils/FetchBackend/rest/api/users';
import FetchItemBrand from '../../utils/FetchBackend/rest/api/item-brands';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';
import BrowserDownloadFileController from '../../package/BrowserDownloadFileController';

export default function GetBrandsPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(<></>);
  const [brands, setBrands] = useState([
    {
      dp_id: 0,
      dp_name: '',
      dp_photoUrl: '',
      dp_urlSegment: '',
      dp_sortingIndex: 0,
      dp_seoKeywords: '',
      dp_seoDescription: '',
      dp_isHidden: false,
    },
  ]);

  useEffect(() => {
    (async function () {
      try {
        await FetchUsers.isAdmin();

        const itemBrands = (await FetchItemBrand.get()).sort(
          (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
        );
        setBrands(itemBrands);
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception, navigate);
      }
    })();
  }, [navigate]);

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

      await FetchItemBrand.remove(id);

      const itemBrands = (await FetchItemBrand.get()).sort(
        (a, b) => a.dp_sortingIndex - b.dp_sortingIndex,
      );
      setBrands(itemBrands);
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  function saveAsJson() {
    const filename = 'DP_CTL_ItemBrands.json';
    const text = JSON.stringify(brands, null, 2);
    BrowserDownloadFileController.downloadFile(filename, text);
  }

  async function saveItemsAsXlsx() {
    try {
      const headers = [
        'id',
        'Сортировка',
        'Наименование',
        'Картинка',
        'Ссылка',
        'Ключевые слова',
        'Описание',
        'Скрыт',
      ];

      const workbook = xlsx.utils.book_new();

      const arr = brands.sort((a, b) => a.dp_sortingIndex - b.dp_sortingIndex);

      const data: string[][] = [];

      for (let j = 0; j < arr.length; ++j) {
        const brand = arr[j];
        data.push([
          `${brand.dp_id}`,
          `${brand.dp_sortingIndex}`,
          brand.dp_name,
          brand.dp_photoUrl,
          brand.dp_urlSegment,
          brand.dp_seoKeywords,
          brand.dp_seoDescription,
          brand.dp_isHidden ? '1' : '0',
        ]);
      }

      const worksheet = xlsx.utils.aoa_to_sheet([headers, ...data]);
      xlsx.utils.book_append_sheet(workbook, worksheet, `all`);

      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      const filename = 'DP_CTL_ItemBrands.xlsx';
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
          <button onClick={() => navigate('new/create')}>Создать новый</button>
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
          {brands.map(e => {
            return (
              <tr key={e.dp_id}>
                <td>{e.dp_id}</td>
                <td>{e.dp_sortingIndex}</td>
                <td>
                  {!e.dp_photoUrl ? 'нет' : <img src={e.dp_photoUrl} alt="x" />}
                </td>
                <td>{e.dp_name}</td>
                <td>{e.dp_urlSegment}</td>
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
