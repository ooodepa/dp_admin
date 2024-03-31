import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';

import AppModal from '../AppModal/AppModal';
import AppInput from '../AppInput/AppInput';
import AppTextArea from '../AppTextArea/AppTextArea';
import styles from './UpdateItemBrandPage.module.css';
import AppContainer from '../AppContainer/AppContainer';
import FetchUsers from '../../utils/FetchBackend/rest/api/users';
import HttpException from '../../utils/FetchBackend/HttpException';
import FetchItemBrand from '../../utils/FetchBackend/rest/api/item-brands';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';
import ItemBrandWithIdDto from '../../utils/FetchBackend/rest/api/item-brands/dto/item-brand-with-id.dto';
import ItemBrandDto from '../../utils/FetchBackend/rest/api/item-brands/dto/item-brand.dto';

export default function UpdateBrandPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState(<></>);
  const [is404, setIs404] = useState(false);
  const [original, setOriginal] = useState<ItemBrandWithIdDto>({
    dp_id: 0,
    dp_seoTitle: '',
    dp_photoUrl: '',
    dp_seoUrlSegment: '',
    dp_sortingIndex: 0,
    dp_seoKeywords: '',
    dp_seoDescription: '',
    dp_isHidden: false,
  });
  const [data, setData] = useState<ItemBrandWithIdDto>({
    dp_id: 0,
    dp_seoTitle: '',
    dp_photoUrl: '',
    dp_seoUrlSegment: '',
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

    if (data.dp_seoTitle.length === 0) {
      formErrors.dp_name = 'Наименование не указано (оно обязательно)';
    }

    if (data.dp_seoDescription.length === 0) {
      formErrors.dp_seoDescription = 'Описание не указано (оно обязательно)';
    }

    if (data.dp_seoUrlSegment.length === 0) {
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
                <AppInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_seoTitle"
                  value={data.dp_seoTitle}
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td>URL сегмент</td>
              <td>
                <AppInput
                  type="text"
                  onChange={handleOnChange}
                  name="dp_seoUrlSegment"
                  value={data.dp_seoUrlSegment}
                  errors={errors}
                />
              </td>
            </tr>
            <tr>
              <td>
                Индекс <br /> для сортировки
              </td>
              <td>
                <AppInput
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
                <AppInput
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
                <AppInput
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
                <AppTextArea
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
                <AppTextArea
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
