import {
  ChangeEvent,
  InputHTMLAttributes,
  SyntheticEvent,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AppModal from '../AppModal/AppModal';
import styles from './UpdateItemPage.module.css';
import AppContainer from '../AppContainer/AppContainer';
import FetchItems from '../../utils/FetchBackend/rest/api/items';
import FetchUsers from '../../utils/FetchBackend/rest/api/users';
import HttpException from '../../utils/FetchBackend/HttpException';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';
import FetchItemCategories from '../../utils/FetchBackend/rest/api/item-categories';
import UpdateItemDto from '../../utils/FetchBackend/rest/api/items/dto/update-item.dto';
import BrowserDownloadFileController from '../../package/BrowserDownloadFileController';
import FetchItemCharacteristics from '../../utils/FetchBackend/rest/api/item-characteristics';

export default function UpdateItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState(<></>);
  const [is404, setIs404] = useState(false);
  const [itemCharacteristics, setItemCharacteristics] = useState([
    {
      dp_id: 0,
      dp_name: '',
    },
  ]);
  const [itemCategories, setItemCategories] = useState([
    {
      dp_id: 0,
      dp_name: '',
      // dp_sortingIndex: 0,
      // dp_urlSegment: '',
      // dp_photoUrl: '',
      // dp_seoKeywords: '',
      // dp_seoDescription: '',
      // dp_isHidden: false,
      // dp_itemBrandId: 0,
    },
  ]);
  const [original, setOriginal] = useState({
    dp_id: '',
    dp_name: '',
    dp_model: '',
    dp_cost: 0,
    dp_photoUrl: '',
    dp_seoKeywords: '',
    dp_seoDescription: '',
    dp_itemCategoryId: 0,
    dp_isHidden: false,
    dp_itemCharacteristics: [
      {
        dp_characteristicId: 0,
        dp_value: '',
      },
    ],
    dp_itemGalery: [{ dp_photoUrl: '' }],
  });
  const [data, setData] = useState({
    dp_id: '',
    dp_name: '',
    dp_model: '',
    dp_cost: 0,
    dp_photoUrl: '',
    dp_seoKeywords: '',
    dp_seoDescription: '',
    dp_itemCategoryId: 0,
    dp_isHidden: false,
    dp_itemCharacteristics: [
      {
        dp_characteristicId: 0,
        dp_value: '',
      },
    ],
    dp_itemGalery: [{ dp_photoUrl: '' }],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!id) {
      return;
    }

    (async function () {
      try {
        const dp_id: string = id as string;
        if (dp_id.length === 0) {
          return;
        }

        await FetchUsers.isAdmin();

        const item = await FetchItems.getById(dp_id);
        const DATA = {
          dp_id: item.dp_id,
          dp_name: item.dp_name,
          dp_model: item.dp_model,
          dp_cost: item.dp_cost,
          dp_photoUrl: item.dp_photoUrl,
          dp_seoKeywords: item.dp_seoKeywords,
          dp_seoDescription: item.dp_seoDescription,
          dp_itemCategoryId: item.dp_itemCategoryId,
          dp_isHidden: item.dp_isHidden === '1',
          dp_itemCharacteristics: item.dp_itemCharacteristics.map(e => ({
            dp_characteristicId: e.dp_characteristicId,
            dp_value: e.dp_value,
          })),
          dp_itemGalery: item.dp_itemGalery,
        };
        setData(DATA);
        setOriginal(DATA);
        setIs404(false);

        setItemCharacteristics(await FetchItemCharacteristics.get());
        setItemCategories(await FetchItemCategories.get());
      } catch (exception) {
        if (exception instanceof HttpException) {
          if (exception.HTTP_STATUS === 404) {
            setIs404(true);
          }
          if (exception.HTTP_STATUS === 401) {
            navigate('/');
          }
          return;
        }

        await AsyncAlertExceptionHelper(exception, navigate);
      }
    })();
  }, [id, navigate]);

  function handleOnChangeSelectElement(e: ChangeEvent<HTMLSelectElement>) {
    setErrors({});
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: Number(value) }));
  }

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setData(prev => ({ ...prev, [name]: Number(value) }));
      return;
    }

    if (type === 'checkbox') {
      const { checked } = e.target;
      setData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (/^dp_itemCharacteristics\[\d+\]$/.test(name)) {
      const characteristicId = Number(name.replace(/\D/g, ''));

      const arr = data.dp_itemCharacteristics.filter(
        e => e.dp_characteristicId !== characteristicId,
      );
      arr.push({
        dp_characteristicId: characteristicId,
        dp_value: value,
      });

      const resultArray = arr
        .filter(e => e.dp_value.length)
        .sort((a, b) => a.dp_characteristicId - b.dp_characteristicId);

      setData(prev => ({ ...prev, dp_itemCharacteristics: resultArray }));
      return;
    }

    if (name === 'dp_itemGalery') {
      setData(prev => ({
        ...prev,
        dp_itemGalery: value
          .split(/\s+/)
          .map(e => ({ dp_photoUrl: e }))
          .filter(e => e.dp_photoUrl.length),
      }));
      return;
    }

    setData(prev => ({ ...prev, [name]: value }));
  }

  function handleOnSubmit(event: SyntheticEvent) {
    event.preventDefault();

    let formErrors: Record<string, any> = {};

    if (data.dp_name.length === 0) {
      formErrors.dp_name = 'Наименование не указано (оно обязательно)';
    }

    if (data.dp_model.length === 0) {
      formErrors.dp_model = 'Модель не указана (она обязательна)';
    }

    if (data.dp_seoDescription.length === 0) {
      formErrors.dp_seoDescription = 'Описание не указано (оно обязательно)';
    }

    if (data.dp_itemCategoryId === 0) {
      formErrors.dp_itemCategoryId = 'Категория не указана (она обязательна)';
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      setModal(
        <AppModal
          title="Обновление элемента"
          message={
            'Проверите правильность заполнения полей \n' +
            Object.keys(formErrors)
              .map(name => `${name}: ${formErrors[name]}`)
              .join('\n')
          }>
          <button onClick={() => setModal(<></>)}>Вернуться к форме</button>
        </AppModal>,
      );

      return;
    }

    setModal(
      <AppModal
        title="Обновление элемента"
        message="Вы уверены, что хотите сохранить это">
        <button onClick={save}>Сохранить</button>
        <button onClick={() => setModal(<></>)}>Не сохранять</button>
      </AppModal>,
    );
  }

  async function save() {
    try {
      setModal(<></>);

      if (JSON.stringify(original) === JSON.stringify(data)) {
        setModal(
          <AppModal
            title="Обновление элемента"
            message="Вы не редактировали элемент. Нет того, что сохранить">
            <button onClick={() => setModal(<></>)}>Закрыть</button>
          </AppModal>,
        );
        return;
      }

      const dto: UpdateItemDto = {
        ...data,
        dp_itemCharacteristics: data.dp_itemCharacteristics.filter(
          e => e.dp_value.length,
        ),
        dp_itemGalery: data.dp_itemGalery.filter(e => e.dp_photoUrl.length),
      };

      await FetchItems.update(data.dp_id, dto);

      navigate('/items');
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  function saveAsJson() {
    const dp_id: string = id as string;
    const filename = `DP_CTL_Item__id=${dp_id}.json`;
    const itemData: UpdateItemDto = { ...data };
    const text = JSON.stringify(itemData, null, 2);
    BrowserDownloadFileController.downloadFile(filename, text);
  }

  function toListPage() {
    if (JSON.stringify(original) === JSON.stringify(data)) {
      navigate('/items');
      return;
    }

    setModal(
      <AppModal
        title="Обновление элемента"
        message="Вы отредактировали элемент, но не сохранили.">
        <button onClick={() => setModal(<></>)}>Вернуться к форме</button>
        <button onClick={() => navigate('/items')}>Не сохранять</button>
      </AppModal>,
    );
  }

  if (is404) {
    return <p>Нет такой номенклатуры в БД с таким UUID (dp_id={id})</p>;
  }

  return (
    <AppContainer>
      {modal}
      <h2>Редактор номенклатуры</h2>
      <div style={{ textAlign: 'right' }}>
        <button className={styles.form__button} onClick={saveAsJson}>
          Скачать как JSON
        </button>
        <button className={styles.form__button} onClick={toListPage}>
          Вернуться к списку
        </button>
      </div>
      <form onSubmit={handleOnSubmit} className={styles.form}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td colSpan={2}>Основные характеристики</td>
            </tr>
            <tr>
              <td>ID</td>
              <td>{data.dp_id}</td>
            </tr>
            <tr>
              <td>Наименование</td>
              <td>
                <MyInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_name"
                  value={data.dp_name}
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td>Модель</td>
              <td>
                <MyInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_model"
                  value={data.dp_model}
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td>Цена</td>
              <td>
                <MyInput
                  type="number"
                  onChange={handleOnChange}
                  name="dp_cost"
                  value={data.dp_cost}
                  step="0.01"
                  min="0"
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td>Скрыт</td>
              <td>
                <MyInput
                  id="isCheked"
                  type="checkbox"
                  name="dp_isHidden"
                  checked={data.dp_isHidden}
                  onChange={handleOnChange}
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td>Категории</td>
              <td>
                <select
                  name="dp_itemCategoryId"
                  onChange={handleOnChangeSelectElement}
                  value={data.dp_itemCategoryId}
                  data-has-errors={
                    (
                      ((errors || {}) as Record<string, any>)[
                        'dp_itemCategoryId'
                      ] || ''
                    ).length
                      ? '1'
                      : '0'
                  }>
                  <option value="0"> - - - Выберите категорию</option>
                  {itemCategories.map(e => {
                    return (
                      <option key={e.dp_id} value={e.dp_id}>
                        {e.dp_id} - {e.dp_name}
                      </option>
                    );
                  })}
                </select>
                <span
                  data-has-errors={
                    (
                      ((errors || {}) as Record<string, any>)[
                        'dp_itemCategoryId'
                      ] || ''
                    ).length
                      ? '1'
                      : '0'
                  }>
                  {((errors || {}) as Record<string, any>)[
                    'dp_itemCategoryId'
                  ] || 'нет ошибки'}
                </span>
              </td>
            </tr>
            <tr>
              <td>Картинка</td>
              <td>
                <MyInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_photoUrl"
                  value={data.dp_photoUrl}
                  errors={errors}
                  placeholder="https://example.com/image.png (укажите ссылку на изображение)"
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                {!data.dp_photoUrl.length ? (
                  'не указано изображение'
                ) : (
                  <img
                    src={data.dp_photoUrl}
                    alt={`не рабочая ссылка ("${data.dp_photoUrl}")`}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td>Описание</td>
              <td>
                <MyTextArea
                  onChange={handleOnChange}
                  name="dp_seoDescription"
                  value={data.dp_seoDescription}
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td>Ключевые слова</td>
              <td>
                <MyTextArea
                  onChange={handleOnChange}
                  name="dp_seoKeywords"
                  value={data.dp_seoKeywords}
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>Табличная часть - Галерея</td>
            </tr>

            <tr>
              <td>
                Галерея <br />
                <span style={{ color: 'gray' }}>(через Enter)</span>
              </td>
              <td>
                <MyTextArea
                  onChange={handleOnChange}
                  name="dp_itemGalery"
                  value={data.dp_itemGalery.map(e => e.dp_photoUrl).join('\n')}
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                {!data.dp_itemGalery.length ? 'галерея пуста' : null}
                <ol>
                  {data.dp_itemGalery.map((e, index) => {
                    return (
                      <li key={index}>
                        {!e.dp_photoUrl.length ? (
                          'не указано изображение'
                        ) : (
                          <img
                            src={e.dp_photoUrl}
                            alt={`не рабочая ссылка ("${e.dp_photoUrl}")`}
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                Табличная часть - Дополнительные характеристики
              </td>
            </tr>
            {itemCharacteristics.map((e, index) => {
              const value =
                data.dp_itemCharacteristics.find(
                  ch => ch.dp_characteristicId === e.dp_id,
                )?.dp_value || '';

              return (
                <tr key={e.dp_id}>
                  <td>{e.dp_name}</td>
                  <td>
                    <MyInput
                      type="text"
                      onChange={handleOnChange}
                      name={`dp_itemCharacteristics[${e.dp_id}]`}
                      value={value}
                      errors={errors}
                    />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={2}>
                <input type="submit" value="Обновить элемент" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </AppContainer>
  );
}

interface IMyInputProps<T> extends InputHTMLAttributes<T> {
  errors: any;
}

function MyInput(props: IMyInputProps<any>) {
  const errors = props.errors || {};
  const name = props.name || '_';
  const currentError = errors[name] || '';

  return (
    <>
      {props.type !== 'checkbox' ? null : (
        <label
          htmlFor={props.id}
          data-is-cheked={props.checked ? '1' : '0'}></label>
      )}
      <input data-has-errors={!currentError.length ? '0' : '1'} {...props} />
      <span data-has-errors={!currentError.length ? '0' : '1'}>
        {currentError}
      </span>
    </>
  );
}

interface IMyTextAreaProps<T> extends TextareaHTMLAttributes<T> {
  errors: any;
}

function MyTextArea(props: IMyTextAreaProps<any>) {
  const errors = props.errors || {};
  const name = props.name || '_';
  const currentError = errors[name] || '';

  return (
    <>
      <textarea
        name={props.name}
        onChange={props.onChange}
        value={props.value}
        data-has-errors={currentError.length ? '1' : '0'}
      />
      <span data-has-errors={currentError.length ? '1' : '0'}>
        {currentError}
      </span>
    </>
  );
}
