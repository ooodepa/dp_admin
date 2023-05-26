import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppModal from '../AppModal/AppModal';
import TableView from '../TableView/TableView';
import FetchUsers from '../../utils/FetchBackend/rest/api/users';
import FetchItemBrand from '../../utils/FetchBackend/rest/api/item-brands';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';

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

  return (
    <TableView
      side={
        <>
          <button onClick={() => navigate('new/create')}>Создать новый</button>
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
