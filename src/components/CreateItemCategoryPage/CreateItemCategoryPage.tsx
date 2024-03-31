import { useNavigate } from 'react-router-dom';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';

import AppModal from '../AppModal/AppModal';
import AppInput from '../AppInput/AppInput';
import AppTextArea from '../AppTextArea/AppTextArea';
import AppContainer from '../AppContainer/AppContainer';
import styles from './CreateItemCategoryPage.module.css';
import FetchUsers from '../../utils/FetchBackend/rest/api/users';
import FetchItemBrand from '../../utils/FetchBackend/rest/api/item-brands';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';
import FetchItemCategories from '../../utils/FetchBackend/rest/api/item-categories';
import ItemCategoryWithIdDto from '../../utils/FetchBackend/rest/api/item-categories/dto/item-category-with-id.dto';
import GetItemBrandDto from '../../utils/FetchBackend/rest/api/item-brands/dto/get-item-brand.dto';

export default function CreateItemCategoryPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(<></>);
  const [data, setData] = useState<ItemCategoryWithIdDto>({
    dp_id: 0,
    dp_itemBrandId: 0,
    dp_seoTitle: '',
    dp_photoUrl: '',
    dp_seoUrlSegment: '',
    dp_sortingIndex: 0,
    dp_seoKeywords: '',
    dp_seoDescription: '',
    dp_isHidden: false,
  });
  const [brands, setBrands] = useState<GetItemBrandDto[]>([]);
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

    if (data.dp_seoTitle.length === 0) {
      formErrors.dp_name = 'Наименование не указано (оно обязательно)';
    }

    if (data.dp_seoDescription.length === 0) {
      formErrors.dp_seoDescription = 'Описание не указано (оно обязательно)';
    }

    if (data.dp_seoUrlSegment.length === 0) {
      formErrors.dp_urlSegment = 'URL сегмент не указан (он обязателен)';
    }

    if (data.dp_itemBrandId === 0) {
      formErrors.dp_itemBrandId = 'Бренд не указан (он обязателен)';
    }

    setErrors(formErrors);

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
                        {e.dp_id} - {e.dp_seoTitle}
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
                  {((errors || {}) as Record<string, any>)['dp_itemBrandId'] ||
                    'нет ошибки'}
                </span>
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
                <input type="submit" value="Добавить" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </AppContainer>
  );
}
