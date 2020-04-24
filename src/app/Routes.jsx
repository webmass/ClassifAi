import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from 'containers/Home/Home';
import NotFoundPage from 'containers/NotFoundPage/NotFoundPage';
import ModelDetails from 'containers/ModelDetails/ModelDetails';
import ModelForm from 'containers/ModelForm/ModelForm';
import { getModelDetailsRoute, getModelFormRoute } from 'services/RoutingService';
import { ROUTES } from './constants';
import Account from 'containers/Account/Account';

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Home}/>
        <Route path={ROUTES.HOME} component={Home} />
        <Route path={ROUTES.ACCOUNT} component={Account} />
        <Route path={getModelDetailsRoute(':id')} component={ModelDetails} />
        <Route path={getModelFormRoute(':id')} component={ModelForm} />
        <Route path={getModelFormRoute()} component={ModelForm} />
        <Route path="*" component={NotFoundPage} />
    </Switch>
);

export default Routes;
