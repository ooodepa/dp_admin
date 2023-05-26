import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './TableView.module.css';

interface IProps {
  children: ReactNode;
  side: ReactNode;
}

export default function TableView(props: IProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.table__block}>{props.children}</div>
      <div className={styles.side__block}>
        <button onClick={() => navigate('/')}>На главную</button>
        {props.side}
      </div>
    </div>
  );
}
