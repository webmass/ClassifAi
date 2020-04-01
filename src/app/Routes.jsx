import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from 'containers/Home/Home';
import NotFoundPage from 'containers/NotFoundPage/NotFoundPage';
import ModelDetails from 'containers/ModelDetails/ModelDetails';
import ModelForm from 'containers/ModelForm/ModelForm';
import { getModelDetailsRoute, getModelFormRoute } from 'services/RoutingService';
import {HOME_ROUTE} from './constants';

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Home}/>
        <Route path={HOME_ROUTE} component={Home} />
        <Route path={getModelDetailsRoute(':id')} component={ModelDetails} />
        <Route path={getModelFormRoute(':id')} component={ModelForm} />
        <Route path={getModelFormRoute()} component={ModelForm} />
        <Route path="*" component={NotFoundPage} />
    </Switch>
);

export default Routes;
