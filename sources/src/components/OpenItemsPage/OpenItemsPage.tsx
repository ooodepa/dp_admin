import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, ChangeEvent } from 'react';

import AppInput from '../AppInput/AppInput';
import TableView from '../TableView/TableView';
import styles from './OpenItemsPage.module.css';
import FetchItems from '../../utils/FetchBackend/rest/api/items';
import ItemDto from '../../utils/FetchBackend/rest/api/items/dto/item.dto';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';
import BrowserDownloadFileController from '../../package/BrowserDownloadFileController';
import FetchItemCharacteristics from '../../utils/FetchBackend/rest/api/item-characteristics';
import GetItemCharacteristicDto from '../../utils/FetchBackend/rest/api/item-characteristics/dto/get-item-characteristic.dto';

export default function OpenItemsPage() {
  const [arr, setArr] = useState<ItemDto[]>([]);
  const [characteristics, setCharacteristics] = useState<
    GetItemCharacteristicDto[]
  >([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      const ch = await FetchItemCharacteristics.get();
      setCharacteristics(ch);

      const h = [
        'id',
        'Наименование',
        'Модель',
        'Цена',
        'Картинка',
        'Ключевые слова',
        'Описание',
        'Код категории',
        'Галерея',
      ];

      for (let i = 0; i < ch.length; ++i) {
        h.push(ch[i].dp_name);
      }

      setHeaders(h);
    })();
  }, []);

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
          const d: ItemDto[] = [];
          const h = jsonData[0];
          for (let i = 1; i < jsonData.length; ++i) {
            const line = jsonData[i];
            d.push({
              dp_id: line[h.indexOf('id')] || '',
              dp_name: line[h.indexOf('Наименование')],
              dp_cost: Number(line[h.indexOf('Цена')]),
              // dp_isHidden: line[h.indexOf('Скрыт')] === '1',
              dp_itemCategoryId: Number(line[h.indexOf('Код категории')]),
              dp_model: line[h.indexOf('Модель')],
              dp_photoUrl: line[h.indexOf('Картинка')],
              dp_seoDescription: line[h.indexOf('Описание')],
              dp_seoKeywords: line[h.indexOf('Ключевые слова')] || '',
              dp_itemGalery: (line[h.indexOf('Галерея')] || '')
                .split(' ')
                .map(e => {
                  return {
                    // dp_id: -1,
                    // dp_itemId: '-1',
                    dp_photoUrl: e,
                  };
                })
                .filter(obj => obj.dp_photoUrl !== ''),
              dp_itemCharacteristics: characteristics
                .map(e => {
                  const value = line[h.indexOf(e.dp_name)] || '';
  
                  return {
                    dp_characteristicId: e.dp_id,
                    dp_value: value,
                    // dp_itemId: '',
                    // dp_id: -1,
                  };
                })
                .filter(obj => obj.dp_value !== ''),
            });
          }
  
          setArr(d);
        };

        reader.readAsBinaryString(file);
      }

      if (RegExp('.json$').test(`${event.target.files?.[0].name}`)) {
        reader.onload = e => {
          const text = `${e.target?.result}`;
          console.log(text);
          const json: ItemDto[] = JSON.parse(text);
          console.log(json);
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
    const filename = 'bulk_DP_CTL_Items.json';
    const arrJSON = [...arr];
    for (let i = 0; i < arr.length; ++i) {
      arrJSON[i].dp_itemCharacteristics = arr[i].dp_itemCharacteristics;
    }
    const obj = { bulk: arrJSON };
    const text = JSON.stringify(obj, null, 2);
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

  function hasDublicateModels() {
    const setModels: Set<string> = new Set();
    arr.forEach(e => {
      setModels.add(e.dp_model);
    });
    const arrModels = Array.from(setModels);

    return arrModels.length !== arr.length;
  }

  function hasDublicateDescriptions() {
    const setDescriptions: Set<string> = new Set();
    arr.forEach(e => {
      setDescriptions.add(e.dp_seoDescription);
    });
    const arrDescriptions = Array.from(setDescriptions);

    return arrDescriptions.length !== arr.length;
  }

  async function createBulk() {
    try {
      if (hasDublicateName()) {
        alert('Есть дубликаты наименования!!!');
        return;
      }

      if (hasDublicateModels()) {
        alert('Есть дубликаты модели!!!');
        return;
      }

      if (hasDublicateDescriptions()) {
        alert('Есть дубликаты описания!!!');
        return;
      }

      const isAdded = await FetchItems.createBulk(arr);
      if (isAdded) {
        alert('Данные добавлены в БД');
      }

      navigate('/items');
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
                <td>
                  <img src={e.dp_photoUrl} alt="" height={30} />
                </td>
                <td>{e.dp_id}</td>
                <td>{e.dp_name}</td>
                <td>{e.dp_model}</td>
                <td>{e.dp_cost}</td>
                <td>{e.dp_photoUrl}</td>
                <td>{e.dp_seoKeywords}</td>
                <td>{e.dp_seoDescription}</td>
                <td>{e.dp_itemCategoryId}</td>
                <td>{e.dp_itemGalery.map(g => g.dp_photoUrl).join(' ')}</td>
                {characteristics.map((char, charI) => {
                  for (let i = 0; i < e.dp_itemCharacteristics.length; ++i) {
                    const itemChar = e.dp_itemCharacteristics[i];
                    if (char.dp_id === itemChar.dp_characteristicId) {
                      return <td key={charI}>{itemChar.dp_value}</td>;
                    }
                  }
                  return <td key={charI}></td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableView>
  );
}
