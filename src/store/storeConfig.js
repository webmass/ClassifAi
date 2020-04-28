import * as RTK from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import modelsReducer, { updateModels } from 'store/slices/modelsSlice';
import searchReducer from 'store/slices/searchSlice';
import Database from 'services/Database';

const rootReducer = combineReducers({
    models: modelsReducer,
    lastSearchValue: searchReducer
});

const storeConfig = RTK.configureStore({
    reducer: rootReducer
});

export const rehydrateStore = async () => {
    storeConfig.dispatch(updateModels(await Database.getModels()));
};

export default storeConfig;
