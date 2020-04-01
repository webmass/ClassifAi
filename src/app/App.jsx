import React, { useState } from 'react';
import TensorFlowService from 'services/TensorFlowService';
import Message from 'components/Message/Message';
import { HashRouter as Router } from 'react-router-dom'
import Routes from './Routes';
import './App.css';

const App = () => {
    const [hasModelLoaded, setHasModelLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    TensorFlowService.initBaseModel()
        .then(() => setHasModelLoaded(true))
        .catch(() => setHasError(true));

    const main = (
        <Router>
            <Routes/>
        </Router>
    );

    return (
        <div className="App">
            {hasModelLoaded && !hasError ? main : <Message.Loading>Loading Model...</Message.Loading>}
            {hasError ? <Message.Error>Error initializing</Message.Error> : null}
        </div>
    );
};

export default App;
