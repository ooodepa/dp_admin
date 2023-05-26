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
import styles from './UpdateItemBrandPage.module.css';
import AppContainer from '../AppContainer/AppContainer';
import FetchUsers from '../../utils/FetchBackend/rest/api/users';
import HttpException from '../../utils/FetchBackend/HttpException';
import FetchItemBrand from '../../utils/FetchBackend/rest/api/item-brands';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';

export default function UpdateBrandPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState(<></>);
  const [is404, setIs404] = useState(false);
  const [original, setOriginal] = useState({
    dp_id: 0,
    dp_name: '',
    dp_photoUrl: '',
    dp_urlSegment: '',
    dp_sortingIndex: 0,
    dp_seoKeywords: '',
    dp_seoDescription: '',
    dp_isHidden: false,
  });
  const [data, setData] = useState({
    dp_id: 0,
    dp_name: '',
    dp_photoUrl: '',
    dp_urlSegment: '',
    dp_sortingIndex: 0,
    dp_seoKeywords: '',
    dp_seoDescription: '',
    dp_isHidden: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const dp_id: number = Number(id);

    if (!dp_id) {
      setIs404(true);
      return;
    }

    (async function () {
      try {
        await FetchUsers.isAdmin();

        const brand = await FetchItemBrand.getById(dp_id);
        setData(brand);
        setOriginal(brand);
        setIs404(false);
      } catch (exception) {
        if (exception instanceof HttpException) {
          if (exception.HTTP_STATUS === 404) {
            setIs404(true);
            return;
          }
        }

        await AsyncAlertExceptionHelper(exception, navigate);
      }
    })();
  }, [id, navigate]);

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

    setModal(
      <AppModal
        title="Сохранение элемента"
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
            title="Сохранение элемента"
            message="Вы не редактировали элемент. Нет того, что сохранить">
            <button onClick={() => setModal(<></>)}>Закрыть</button>
          </AppModal>,
        );
        return;
      }

      await FetchItemBrand.update(data.dp_id, data);
      navigate('/item-brands');
    } catch (exception) {
      await AsyncAlertExceptionHelper(exception, navigate);
    }
  }

  function toListPage() {
    if (JSON.stringify(original) === JSON.stringify(data)) {
      navigate('/item-brands');
      return;
    }

    setModal(
      <AppModal
        title="Сохранение элемента"
        message="Вы отредактировали элемент, но не сохранили.">
        <button onClick={() => setModal(<></>)}>Вернуться к форме</button>
        <button onClick={() => navigate('/brands')}>Не сохранять</button>
      </AppModal>,
    );
  }

  if (is404) {
    return <p>Нет такого бренда в БД (dp_id={id})</p>;
  }

  return (
    <AppContainer>
      {modal}
      <h2>Редактор бренда</h2>
      <div className={styles.specialButtons}>
        <button onClick={toListPage}>Вернуться к списку</button>
      </div>
      <form onSubmit={handleOnSubmit} className={styles.form}>
        <table className={styles.table}>
          <tbody>
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
                <input type="submit" value="Сохранить" />
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
