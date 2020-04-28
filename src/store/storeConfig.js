import * as RTK from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import modelsReducer, { updateModels } from 'store/slices/modelsSlice';
import communityModelsReducer from 'store/slices/communityModelsSlice';
import searchReducer from 'store/slices/searchSlice';
import Database from 'services/Database';

const rootReducer = combineReducers({
    models: modelsReducer,
    communityModels: communityModelsReducer,
    lastSearchValue: searchReducer
});

const storeConfig = RTK.configureStore({
    reducer: rootReducer
});

export const rehydrateStore = async () => {
    storeConfig.dispatch(updateModels(await Database.getModels()));
};

export default storeConfig;
