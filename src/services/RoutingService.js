import { ROUTES } from 'app/constants';

export const goBack = (history) => history.location.state ? history.goBack() : history.push(ROUTES.HOME);
export const goHome = (history, isReplace = false) => history[isReplace ? 'replace' : 'push'](ROUTES.HOME);
export const getModelDetailsRoute = id => `${ROUTES.MODEL_DETAILS}/${id}`;
export const getModelFormRoute = id => `${ROUTES.MODEL_FORM}${id ? '/' + id : ''}`;
