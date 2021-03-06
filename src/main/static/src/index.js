import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {useRouterHistory} from 'react-router'
import {createHistory} from 'history'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './store/configureStore'
import routes from './routes'
import { Router } from 'react-router'
import PropertySingleton from "./globals/PropertySingleton";

import './reset.css';
import './general-style.css';
import 'oph-virkailija-style-guide/oph-styles.css'
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';
import './flex.css';

let store = configureStore();
const browserHistory = useRouterHistory(createHistory)({
    basename: '/henkilo-ui'
});
const history = syncHistoryWithStore(browserHistory, store);

window.opintopolku_caller_id = PropertySingleton.getState().opintopolkuCallerId;

render(
    <Provider store={store}>
        <div>
            <Router history={history} routes={routes} onUpdate={() => window.scrollTo(0, 0)} />
        </div>
    </Provider>,
  document.getElementById('root')
);
