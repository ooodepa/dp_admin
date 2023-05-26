import { ReactNode } from 'react';

import styles from './AppContainer.module.css';

interface IProps {
  children: ReactNode;
  style?: object;
}

export default function AppContainer(props: IProps) {
  return (
    <div className={styles.app__container} style={props.style}>
      {props.children}
    </div>
  );
}
