import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AdaptivityProvider, ConfigProvider} from "@vkontakte/vkui";

ReactDOM.render(
    <ConfigProvider>
        <AdaptivityProvider>
            <App/>
        </AdaptivityProvider>
    </ConfigProvider>,
  document.getElementById('root')
);

reportWebVitals();
