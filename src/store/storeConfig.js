import * as RTK from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import modelsReducer, { updateModels } from 'store/slices/modelsSlice';
import Database from 'services/Database';

const rootReducer = combineReducers({
    models: modelsReducer
});

const storeConfig = RTK.configureStore({
    reducer: rootReducer
});

export const rehydrateStore = async () => {
    storeConfig.dispatch(updateModels(await Database.getModels()));
};

export default storeConfig;
