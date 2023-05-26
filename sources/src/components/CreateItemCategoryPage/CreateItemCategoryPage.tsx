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
import AppContainer from '../AppContainer/AppContainer';
import styles from './CreateItemCategoryPage.module.css';
import FetchUsers from '../../utils/FetchBackend/rest/api/users';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';
import FetchItemCategories from '../../utils/FetchBackend/rest/api/item-categories';
import FetchItemBrand from '../../utils/FetchBackend/rest/api/item-brands';

export default function CreateItemCategoryPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(<></>);
  const [data, setData] = useState({
    dp_id: 0,
      dp_itemBrandId: 0,
      dp_name: '',
      dp_photoUrl: '',
      dp_urlSegment: '',
      dp_sortingIndex: 0,
      dp_seoKeywords: '',
      dp_seoDescription: '',
      dp_isHidden: false,
  });
  const [brands, setBrands] = useState([{
    dp_id: 0,
    dp_name: '',
    // dp_photoUrl: '',
    // dp_urlSegment: '',
    // dp_sortingIndex: 0,
    // dp_seoKeywords: '',
    // dp_seoDescription: '',
    // dp_isHidden: false,
  }]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async function () {
      try {
        await FetchUsers.isAdmin();

        const itemBrands = await FetchItemBrand.get();
        setBrands(itemBrands);

      } catch (exception) {
        await AsyncAlertExceptionHelper(exception, navigate);
      }
    })();
  }, [navigate]);

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

    setData(prev => ({ ...prev, [name]: value }));
  }

  function handleOnSubmit(event: SyntheticEvent) {
    event.preventDefault();

    let formErrors: any = {};

    if (data.dp_name.length === 0) {
      formErrors.dp_name = 'Наименование не указано (оно обязательно)';
    }

    if (data.dp_seoDescription.length === 0) {
      formErrors.dp_seoDescription = 'Описание не указано (оно обязательно)';
    }

    if (data.dp_urlSegment.length === 0) {
      formErrors.dp_urlSegment = 'URL сегмент не указан (он обязателен)';
    }

    if (data.dp_itemBrandId === 0) {
      formErrors.dp_itemBrandId = 'Бренд не указан (он обязателен)';
    }

    setErrors(formErrors);
    console.log(formErrors)

    setModal(
      <AppModal
        title="Добавление элемента"
        message="Вы уверены, что хотите добавить эту запись">
        <button onClick={create}>Добавить</button>
        <button onClick={() => setModal(<></>)}>Отмена</button>
      </AppModal>,
    );
  }

  async function create() {
    try {
      await FetchItemCategories.create(data);
      navigate('/item-categories');
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  return (
    <AppContainer>
      {modal}
      <h2>Создание категории</h2>
      <form onSubmit={handleOnSubmit} className={styles.form}>
        <table className={styles.table}>
          <tbody>
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
              <td>Бренд</td>
              <td>
                <select
                  name="dp_itemBrandId"
                  onChange={handleOnChangeSelectElement}
                  defaultValue="0"
                  data-has-errors={
                    (
                      ((errors || {}) as Record<string, any>)[
                        'dp_itemBrandId'
                      ] || ''
                    ).length
                      ? '1'
                      : '0'
                  }>
                  <option value="0"> - - - Выберите бренд</option>
                  {brands.map(e => {
                    return (
                      <option
                        key={e.dp_id}
                        value={e.dp_id}
                        selected={e.dp_id === data.dp_itemBrandId}>
                        {e.dp_id} - {e.dp_name}
                      </option>
                    );
                  })}
                </select>
                <span
                  data-has-errors={
                    (
                      ((errors || {}) as Record<string, any>)[
                        'dp_itemBrandId'
                      ] || ''
                    ).length
                      ? '1'
                      : '0'
                  }>
                  {((errors || {}) as Record<string, any>)[
                    'dp_itemBrandId'
                  ] || 'нет ошибки'}
                </span>
              </td>
            </tr>
            <tr>
              <td>URL сегмент</td>
              <td>
                <MyInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_urlSegment"
                  value={data.dp_urlSegment}
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td>
                Индекс <br /> для сортировки
              </td>
              <td>
                <MyInput
                  type="number"
                  onChange={handleOnChange}
                  name="dp_sortingIndex"
                  value={data.dp_sortingIndex}
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
              <td>Картинка</td>
              <td>
                <MyInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_photoUrl"
                  value={data.dp_photoUrl}
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                {!data.dp_photoUrl.length ? (
                  'не указано изображение'
                ) : (
                  <img src={data.dp_photoUrl} alt="не рабочая ссылка" />
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
              <td colSpan={2}>
                <input type="submit" value="Добавить" />
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
