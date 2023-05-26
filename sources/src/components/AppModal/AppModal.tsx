import { ReactNode } from 'react';
import styles from './AppModal.module.css';

interface IProps {
  title: string;
  message: string;
  children: ReactNode;
}

export default function AppModal(props: IProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.modal}>
        <div className={styles.header}>{props.title}</div>
        <div className={styles.content}>{props.message}</div>
        <div className={styles.buttons}>{props.children}</div>
      </div>
    </div>
  );
}
