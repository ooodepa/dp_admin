import {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UpdateItemPage.module.css';
import { RootStoreDto } from '../../../../store';
import {
  ItemWithIdDto,
  emptyItem,
} from '../../../../types/de-pa.by/api/v1/items/items.dto';
import FetchItems from '../../../../utils/FetchBackend/rest/api/items';
import AppContainer from '../../../../components/AppContainer/AppContainer';
import { DePaByItemTypes } from '../../../../types/de-pa.by/DePaByItemReducer';
import sleep from '../../../../utils/sleep/sleep';

interface ITableElement {
  name: string;
  description: string;
  tag: 'input' | 'textarea';
}

interface InputElement extends ITableElement {
  tag: 'input';
  inputProps: InputHTMLAttributes<any>;
}

interface TextAreaElement extends ITableElement {
  tag: 'textarea';
  textareaProps: TextareaHTMLAttributes<any>;
}

type TableElement = InputElement | TextAreaElement;

export default function UpdateItemPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const itemState = useSelector((state: RootStoreDto) => {
    return state.DePaByItemReducer.item;
  });
  const [original, setOriginal] = useState<ItemWithIdDto>(emptyItem);
  const [item, setItem] = useState<ItemWithIdDto>(emptyItem);
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  const fields: TableElement[] = [
    {
      name: 'dp_id',
      description: 'Код',
      tag: 'input',
      inputProps: {
        readOnly: true,
        type: 'text',
        value: item.dp_id,
        onChange: event => setItem({ ...item, dp_id: event.target.value }),
      },
    },
    {
      name: 'dp_1cCode',
      description: 'Код 1C',
      tag: 'input',
      inputProps: {
        type: 'text',
        value: item.dp_1cCode,
        onChange: event => setItem({ ...item, dp_1cCode: event.target.value }),
      },
    },
    {
      name: 'dp_1cDescription',
      description: 'Наименование 1C',
      tag: 'textarea',
      textareaProps: {
        // type: 'text',
        value: item.dp_1cDescription,
        onChange: event =>
          setItem({ ...item, dp_1cDescription: event.target.value }),
      },
    },
    {
      name: 'dp_1cIsFolder',
      description: 'Это папка',
      tag: 'input',
      inputProps: {
        type: 'checkbox',
        checked: item.dp_1cIsFolder,
        onChange: event =>
          setItem({ ...item, dp_1cIsFolder: event.target.checked }),
      },
    },
    {
      name: 'dp_1cParentId',
      description: 'Код родителя',
      tag: 'input',
      inputProps: {
        type: 'text',
        value: item.dp_1cParentId,
        onChange: event =>
          setItem({ ...item, dp_1cParentId: event.target.value }),
      },
    },
    {
      name: 'dp_seoTitle',
      description: 'SEO заголовок',
      tag: 'input',
      inputProps: {
        type: 'text',
        value: item.dp_seoTitle,
        onChange: event =>
          setItem({ ...item, dp_seoTitle: event.target.value }),
      },
    },
    {
      name: 'dp_seoDescription',
      description: 'SEO описание',
      tag: 'textarea',
      textareaProps: {
        value: item.dp_seoDescription,
        onChange: event =>
          setItem({ ...item, dp_seoDescription: event.target.value }),
      },
    },
    {
      name: 'dp_seoKeywords',
      description: 'SEO ключевые слова',
      tag: 'textarea',
      textareaProps: {
        value: item.dp_seoKeywords,
        onChange: event =>
          setItem({ ...item, dp_seoKeywords: event.target.value }),
      },
    },
    {
      name: 'dp_seoUrlSegment',
      description: 'SEO URL segment',
      tag: 'input',
      inputProps: {
        type: 'text',
        value: item.dp_seoUrlSegment,
        onChange: event =>
          setItem({ ...item, dp_seoUrlSegment: event.target.value }),
      },
    },
    {
      name: 'dp_textCharacteristics',
      description: 'Текст характеристик',
      tag: 'textarea',
      textareaProps: {
        value: item.dp_textCharacteristics,
        onChange: event =>
          setItem({ ...item, dp_textCharacteristics: event.target.value }),
      },
    },
    {
      name: 'dp_photos',
      description: 'Ссылки на картинки',
      tag: 'textarea',
      textareaProps: {
        value: item.dp_photos,
        onChange: event => setItem({ ...item, dp_photos: event.target.value }),
      },
    },
    {
      name: 'dp_photos360',
      description: 'Ссылки на картинки 360',
      tag: 'textarea',
      textareaProps: {
        value: item.dp_photos360,
        onChange: event =>
          setItem({ ...item, dp_photos360: event.target.value }),
      },
    },
    {
      name: 'dp_photoUrl',
      description: 'Ссылка на главную картинку',
      tag: 'input',
      inputProps: {
        type: 'text',
        value: item.dp_photoUrl,
        onChange: event =>
          setItem({ ...item, dp_photoUrl: event.target.value }),
      },
    },
    {
      name: 'dp_wholesaleQuantity',
      description: 'Кол-во в опт. коробке',
      tag: 'input',
      inputProps: {
        type: 'number',
        value: item.dp_wholesaleQuantity,
        onChange: event =>
          setItem({ ...item, dp_wholesaleQuantity: event.target.value }),
      },
    },
    {
      name: 'dp_brand',
      description: 'Бренд',
      tag: 'input',
      inputProps: {
        type: 'text',
        value: item.dp_brand,
        onChange: event => setItem({ ...item, dp_brand: event.target.value }),
      },
    },
    {
      name: 'dp_combinedName',
      description: 'Имя для объединения',
      tag: 'input',
      inputProps: {
        type: 'text',
        value: item.dp_combinedName,
        onChange: event =>
          setItem({ ...item, dp_combinedName: event.target.value }),
      },
    },
    {
      name: 'dp_vendorIds',
      description: 'Артикулы(на разных языках)',
      tag: 'textarea',
      textareaProps: {
        // type: 'text',
        value: item.dp_vendorIds,
        onChange: event =>
          setItem({ ...item, dp_vendorIds: event.target.value }),
      },
    },
    {
      name: 'dp_barcodes',
      description: 'Штрихкоды',
      tag: 'textarea',
      textareaProps: {
        // type: 'text',
        value: item.dp_barcodes,
        onChange: event =>
          setItem({ ...item, dp_barcodes: event.target.value }),
      },
    },
    {
      name: 'dp_length',
      description: 'Длина',
      tag: 'input',
      inputProps: {
        type: 'number',
        value: item.dp_length,
        onChange: event => setItem({ ...item, dp_length: event.target.value }),
      },
    },
    {
      name: 'dp_width',
      description: 'Ширина',
      tag: 'input',
      inputProps: {
        type: 'number',
        value: item.dp_width,
        onChange: event => setItem({ ...item, dp_width: event.target.value }),
      },
    },
    {
      name: 'dp_height',
      description: 'Высота',
      tag: 'input',
      inputProps: {
        type: 'number',
        value: item.dp_height,
        onChange: event => setItem({ ...item, dp_height: event.target.value }),
      },
    },
    {
      name: 'dp_weight',
      description: 'Вес',
      tag: 'input',
      inputProps: {
        type: 'number',
        value: item.dp_weight,
        onChange: event => setItem({ ...item, dp_weight: event.target.value }),
      },
    },
    {
      name: 'dp_cost',
      description: 'Цена без НДС',
      tag: 'input',
      inputProps: {
        type: 'number',
        value: item.dp_cost,
        onChange: event => setItem({ ...item, dp_cost: event.target.value }),
      },
    },
    {
      name: 'dp_currancy',
      description: 'Валюта',
      tag: 'input',
      inputProps: {
        type: 'text',
        value: item.dp_currancy,
        onChange: event =>
          setItem({ ...item, dp_currancy: event.target.value }),
      },
    },
    {
      name: 'dp_sortingIndex',
      description: 'Индекс сортировки',
      tag: 'input',
      inputProps: {
        type: 'number',
        value: item.dp_sortingIndex,
        onChange: event =>
          setItem({ ...item, dp_sortingIndex: event.target.value }),
      },
    },
    {
      name: 'dp_youtubeIds',
      description: 'YouTube ids',
      tag: 'textarea',
      textareaProps: {
        // type: 'text',
        value: item.dp_youtubeIds,
        onChange: event =>
          setItem({ ...item, dp_youtubeIds: event.target.value }),
      },
    },
    {
      name: 'dp_isHidden',
      description: 'Скрыта для показа',
      tag: 'input',
      inputProps: {
        type: 'checkbox',
        checked: item.dp_isHidden,
        onChange: event =>
          setItem({ ...item, dp_isHidden: event.target.checked }),
      },
    },
    {
      name: 'dp_itemCategoryId',
      description: 'Код категории',
      tag: 'input',
      inputProps: {
        readOnly: true,
        type: 'number',
        value: item.dp_itemCategoryId,
        onChange: event =>
          setItem({ ...item, dp_itemCategoryId: event.target.value }),
      },
    },
  ];

  useEffect(() => {
    (async function () {
      try {
        dispatch({ type: DePaByItemTypes.FETCH_DEPABY_ITEM });
        dispatch({ type: DePaByItemTypes.FETCH_DEPABY_ITEM_LOADING });
        const json = await FetchItems.getById('' + id);
        setOriginal(json);
        setItem(json);
        dispatch({
          type: DePaByItemTypes.FETCH_DEPABY_ITEM_SUCCESS,
          payload: json,
        });
      } catch (exception: any) {
        if (exception.response && exception.response.status === '404') {
          dispatch({ type: DePaByItemTypes.FETCH_DEPABY_ITEM_NOT_FOUND });
          return;
        }
        dispatch({
          type: DePaByItemTypes.FETCH_DEPABY_ITEMS_ERROR,
          payload: '' + exception,
        });
      }
    })();
  }, []);

  async function updateItem() {
    try {
      await FetchItems.update(item.dp_id, item);
      alert('Успешно обновлен');
    } catch (exception) {
      alert(exception);
    }
  }

  if (itemState.isLoading) {
    return <p>Загрузка данных из БД</p>;
  }

  if (itemState.isNotFound) {
    return <p>Нет такой номенклатуры в БД с таким UUID (dp_id={id})</p>;
  }

  if (itemState.error) {
    return <pre>{itemState.error}</pre>;
  }

  return (
    <AppContainer>
      <dialog className={styles.dialog} open={isModalOpened}>
        <button onClick={() => setIsModalOpened(false)}>Закрыть</button>
        <button onClick={updateItem}>Save</button>
        <div className={styles.dialog__pre_block}>
          <pre>{JSON.stringify(original, null, 2)}</pre>
          <pre>{JSON.stringify(item, null, 2)}</pre>
        </div>
        <button onClick={() => setIsModalOpened(false)}>Закрыть</button>
        <button onClick={updateItem}>Save</button>
      </dialog>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h2>
            Форма редактирования номенклатуры ({itemState.isLoading ? '1' : '0'}
            )
          </h2>
          <table>
            <tbody>
              {fields.map(e => {
                return (
                  <tr>
                    <td>
                      {e.name} <br />
                      <span style={{ color: 'grey' }}>{e.description}</span>
                    </td>
                    <td>
                      {e.tag === 'input' ? (
                        <input {...e.inputProps} />
                      ) : e.tag === 'textarea' ? (
                        <textarea {...e.textareaProps} />
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={styles.footer}>
          <button onClick={() => setIsModalOpened(true)}>Save</button>
        </div>
      </div>
    </AppContainer>
  );
}
