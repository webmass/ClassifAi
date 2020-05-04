import { ROUTES, SEARCH } from 'app/constants';

export const goHome = (history, isReplace = false) => history[isReplace ? 'replace' : 'push'](ROUTES.HOME);
export const goBack = (history) => {
    const from = history.location.state && history.location.state.from;
    from ? history.goBack() : goHome(history);
};
export const getModelDetailsRoute = id => `${ROUTES.MODEL_DETAILS}/${id}`;
export const getModelFormRoute = id => `${ROUTES.MODEL_FORM}${id ? '/' + id : ''}`;
export const getModelSearchRoute = searchType => `/${SEARCH.BASE}/${searchType}`;
export const goTo = (history, pathname, state = {}) => {
    history.push({pathname, state: {from: history.location.pathname, ...state}});
};
