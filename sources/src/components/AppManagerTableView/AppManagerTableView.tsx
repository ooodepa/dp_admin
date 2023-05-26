import { ReactNode } from 'react';
import styles from './AppManagerTableView.module.css';
import { useNavigate } from 'react-router-dom';

interface IProps {
  children: ReactNode;
  side: ReactNode;
}

export default function AppManagerTableView(props: IProps) {
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
