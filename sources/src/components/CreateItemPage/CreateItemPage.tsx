import {
  ChangeEvent,
  InputHTMLAttributes,
  SyntheticEvent,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import AppModal from '../AppModal/AppModal';
import styles from './CreateItemPage.module.css';
import AppContainer from '../AppContainer/AppContainer';
import FetchUsers from '../../utils/FetchBackend/rest/api/users';
import FetchItems from '../../utils/FetchBackend/rest/api/items';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';
import FetchItemCategories from '../../utils/FetchBackend/rest/api/item-categories';
import CreateItemDto from '../../utils/FetchBackend/rest/api/items/dto/create-item.dto';
import FetchItemCharacteristics from '../../utils/FetchBackend/rest/api/item-characteristics';

export default function CreateItemPage() {
  const navigation = useNavigate();
  const [modal, setModal] = useState(<></>);
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
  const [data, setData] = useState({
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
    (async function () {
      try {
        await FetchUsers.isAdmin();

        setItemCharacteristics(await FetchItemCharacteristics.get());
        setItemCategories(await FetchItemCategories.get());
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception, navigation);
      }
    })();
  }, [navigation]);

  function handleOnChangeSelectElement(e: ChangeEvent<HTMLSelectElement>) {
    setErrors({});
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: Number(value) }));
  }

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setErrors({});

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
      const resultArray = value
        .split(/\s+/)
        .map(e => ({ dp_photoUrl: e }))
        .filter(e => e.dp_photoUrl.length);

      setData(prev => ({ ...prev, [name]: resultArray }));
      return;
    }

    setData(prev => ({ ...prev, [name]: value }));
  }

  async function handleOnSubmit(event: SyntheticEvent) {
    event.preventDefault();

    let formErrors: any = {};

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
          title="Создание элемента"
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

    try {
      const dto: CreateItemDto = {
        ...data,
        dp_itemCharacteristics: data.dp_itemCharacteristics.filter(
          e => e.dp_value.length,
        ),
        dp_itemGalery: data.dp_itemGalery.filter(e => e.dp_photoUrl.length),
      };

      await FetchItems.create(dto);

      navigation('/items');
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigation);
    }
  }

  function toListPage() {
    setModal(
      <AppModal title="Создание элемента" message="Вы не создали элемент.">
        <button onClick={() => setModal(<></>)}>Вернуться к форме</button>
        <button onClick={() => navigation('/items')}>Не создавать</button>
      </AppModal>,
    );
  }

  return (
    <AppContainer>
      {modal}
      <h2>Создание номенклатуры</h2>
      <div className={styles.specialButtons}>
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
              <td>Категория</td>
              <td>
                <select
                  name="dp_itemCategoryId"
                  onChange={handleOnChangeSelectElement}
                  defaultValue="0"
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
                      <option
                        key={e.dp_id}
                        value={e.dp_id}
                        selected={e.dp_id === data.dp_itemCategoryId}>
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
                        <img
                          src={e.dp_photoUrl}
                          alt={`не рабочая ссылка ("${e.dp_photoUrl}")`}
                        />
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
                <input type="submit" value="Создать новый элемент" />
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
      <input data-has-errors={currentError.length ? '1' : '0'} {...props} />
      <span data-has-errors={currentError.length ? '1' : '0'}>
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
