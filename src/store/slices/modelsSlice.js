import * as RTK from '@reduxjs/toolkit';

const modelsSlice = RTK.createSlice({
    name: 'models',
    initialState: [],
    reducers: {
        addModelItem: (state, {payload}) => {
            state.push(payload);
        },
        updateModelItem: (state, {payload}) => {
            let model = state.find(model => model.id === payload.id);
            if (model) {
                model.name = payload.name;
                model.description = payload.description;
                model.categories = payload.categories;
                model.nbTrainings = payload.nbTrainings;
            }
        },
        updateModels: (state, {payload}) => state.splice().concat(payload),
        removeModelItem: (state, {payload}) => state.filter(model => model.id !== payload.id)
    }
});

export const { addModelItem, updateModelItem, updateModels, removeModelItem } = modelsSlice.actions;

export default modelsSlice.reducer;
