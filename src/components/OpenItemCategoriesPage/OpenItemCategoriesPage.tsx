import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useState, ChangeEvent } from 'react';

import AppInput from '../AppInput/AppInput';
import TableView from '../TableView/TableView';
import styles from './OpenItemCategoriesPage.module.css';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';
import FetchItemCategories from '../../utils/FetchBackend/rest/api/item-categories';
import BrowserDownloadFileController from '../../package/BrowserDownloadFileController';
import GetItemCategoryDto from '../../utils/FetchBackend/rest/api/item-categories/dto/get-item-category.dto';

export default function OpenItemCategoriesPage() {
  const [arr, setArr] = useState<GetItemCategoryDto[]>([]);
  const headers = [
    'id',
    'КодКатегории',
    'Сортировка',
    'Наименование',
    'Ссылка',
    'Ключевые слова',
    'Описание',
    'Скрыт',
  ];
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();

      if (RegExp('.xlsx$').test(`${event.target.files?.[0].name}`)) {
        reader.onload = e => {
          const text = e.target?.result;
          const workbook = XLSX.read(text, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData: string[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          const d: GetItemCategoryDto[] = [];
          const h = jsonData[0];
          console.log(jsonData);
          for (let i = 1; i < jsonData.length; ++i) {
            const line = jsonData[i];
            d.push({
              dp_id: Number(line[h.indexOf('id')]),
              dp_itemBrandId: Number(line[h.indexOf('КодКатегории')]),
              dp_sortingIndex: Number(line[h.indexOf('Сортировка')]),
              dp_name: line[h.indexOf('Наименование')],
              dp_photoUrl: line[h.indexOf('Картинка')],
              dp_urlSegment: line[h.indexOf('Ссылка')],
              dp_seoKeywords: line[h.indexOf('Ключевые слова')] || '',
              dp_seoDescription: line[h.indexOf('Описание')],
              dp_isHidden: line[h.indexOf('Скрыт')] === '1' ? true : false,
            });

            setArr(d);
          }
        };
        reader.readAsBinaryString(file);
      }

      if (RegExp('.json$').test(`${event.target.files?.[0].name}`)) {
        reader.onload = e => {
          const text = `${e.target?.result}`;
          const json: GetItemCategoryDto[] = JSON.parse(text);
          setArr(json);
        };

        reader.readAsText(file, 'UTF-8');
      }
    } catch (exception) {
      console.log(exception);
      alert(exception);
    }
  };

  function downloadJson() {
    const filename = 'DP_CTL_ItemCategories.json';
    const text = JSON.stringify(arr, null, 2);
    BrowserDownloadFileController.downloadFile(filename, text);
  }

  function hasDublicateName() {
    const setNames: Set<string> = new Set();
    arr.forEach(e => {
      setNames.add(e.dp_name);
    });
    const arrNames = Array.from(setNames);

    return arrNames.length !== arr.length;
  }

  function hasDublicateDescriptions() {
    const setDescriptions: Set<string> = new Set();
    arr.forEach(e => {
      setDescriptions.add(e.dp_seoDescription);
    });
    const arrDescriptions = Array.from(setDescriptions);

    return arrDescriptions.length !== arr.length;
  }

  function hasId() {
    for (let i = 0; i < arr.length; ++i) {
      if (!arr[i].dp_id) {
        return false;
      }
    }
    return true;
  }

  async function createBulk() {
    try {
      if (hasDublicateName()) {
        alert('Есть дубликаты наименования!!!');
        return;
      }

      if (hasDublicateDescriptions()) {
        alert('Есть дубликаты описания!!!');
        return;
      }

      const isAdded = await FetchItemCategories.createBulk(arr);
      if (isAdded) {
        alert('Данные добавлены в БД');
      }

      navigate('/item-categories');
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  async function updateBulk() {
    try {
      if (hasDublicateName()) {
        alert('Есть дубликаты наименования!!!');
        return;
      }

      if (hasDublicateDescriptions()) {
        alert('Есть дубликаты описания!!!');
        return;
      }

      if (!hasId()) {
        alert('Не у всех записей указаны id!!!');
        return;
      }

      const isAdded = await FetchItemCategories.updateBulk(arr);
      if (isAdded) {
        alert('Данные обновлены в БД');
      }

      navigate('/item-categories');
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  return (
    <TableView
      side={
        <>
          <p>Открыть файл</p>
          <AppInput
            type="file"
            name="file"
            errors={{}}
            onChange={handleFileChange}
            id="open-xlsx"
          />
          <button onClick={downloadJson}>Скачать JSON</button>
          <button onClick={createBulk}>Добавить в БД</button>
          <button onClick={updateBulk}>Обновить данные в БД</button>
        </>
      }>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Img</td>
            {headers.map(e => {
              return <td key={e}>{e}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          {arr.map((e, ei) => {
            return (
              <tr key={ei}>
                <td title={e.dp_photoUrl}>
                  <img src={e.dp_photoUrl} alt="" height={48} />
                </td>
                <td>{e.dp_id}</td>
                <td>{e.dp_itemBrandId}</td>
                <td>{e.dp_sortingIndex}</td>
                <td>{e.dp_name}</td>
                <td>{e.dp_urlSegment}</td>
                <td>{e.dp_seoKeywords ? e.dp_seoKeywords : 'нет'}</td>
                <td>{e.dp_seoDescription}</td>
                <td>{e.dp_isHidden ? 'true' : 'false'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableView>
  );
}
