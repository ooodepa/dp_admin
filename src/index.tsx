import ReactDOM from 'react-dom/client';
import { HashRouter, BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  process.env.REACT_APP__USE_BROWSER_ROUTER === 'true' ? (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ) : (
    <HashRouter>
      <App />
    </HashRouter>
  ),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
