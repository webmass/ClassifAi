import React, { useEffect, useState } from 'react';
import TensorFlowService from 'services/TensorFlowService';
import Message from 'components/Message/Message';
import { HashRouter as Router } from 'react-router-dom'
import Routes from './Routes';
import AppContext from 'app/AppContext';
import ArweaveService from 'services/ArweaveService';
import './App.css';

const App = () => {
    const [hasModelLoaded, setHasModelLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [wallet, setWallet] = useState(null);
    const [appContext] = useState({setWallet});
    appContext.wallet = wallet;

    useEffect(() => {
        ArweaveService.init()
            .then(wallet => setWallet(wallet))
            .catch(() => setWallet(null));
        TensorFlowService.initBaseModel()
            .then(() => setHasModelLoaded(true))
            .catch(() => setHasError(true));
    }, []);

    const main = (
        <Router>
            <AppContext.Provider value={appContext}>
                <Routes/>
            </AppContext.Provider>
        </Router>
    );

    return (
        <div className="App">
            {hasModelLoaded && !hasError ? main : <Message.Loading>Initializing...</Message.Loading>}
            {hasError ? <Message.Error>Error initializing</Message.Error> : null}
        </div>
    );
};

export default App;
