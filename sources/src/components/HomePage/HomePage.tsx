import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './HomePage.module.css';
import FetchUsers from '../../utils/FetchBackend/rest/api/users';
import { AsyncAlertExceptionHelper } from '../../utils/AlertExceptionHelper';

const menu = [
  {
    title: 'Номенклатура',
    href: 'items',
  },
  {
    title: 'Бренды',
    href: 'brands',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('refresh')) {
      navigate('/login');
      return;
    }

    (async function () {
      try {
        await FetchUsers.isAdmin();
      } catch (exception) {
        await AsyncAlertExceptionHelper(exception, navigate);
      }
    })();
  }, [navigate]);

  return (
    <div className={styles.wrapper}>
      <ul>
        {menu.map(e => {
          return (
            <li key={e.href} onClick={() => navigate(e.href)}>
              {e.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
