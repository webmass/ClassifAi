import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'app/App';
import * as serviceWorker from './serviceWorker';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './index.css';
import Database from 'services/Database';
import storeConfig, { rehydrateStore} from 'store/storeConfig';
import moment from 'moment';

Database
    .init()
    .then(async () => {
        await rehydrateStore();
        return ReactDOM.render(
            <React.StrictMode>
                <Provider store={storeConfig}>
                    <App/>
                </Provider>
            </React.StrictMode>,
            document.getElementById('root')
        );
    })
    .catch()
;

moment.locale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s:  'a few secs',
        ss: '%ss',
        m:  'a min',
        mm: '%d mins',
        h:  'an hour',
        hh: '%dh',
        d:  'a day',
        dd: '%d days',
        M:  'a month',
        MM: '%d months',
        y:  'a year',
        yy: '%d years'
    }
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
