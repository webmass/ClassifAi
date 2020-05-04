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
                Object.assign(model, payload);
            }
        },
        updateModels: (state, {payload}) => state.splice().concat(payload),
        removeModelItem: (state, {payload}) => state.filter(model => model.id !== payload)
    }
});

export const { addModelItem, updateModelItem, updateModels, removeModelItem } = modelsSlice.actions;

export default modelsSlice.reducer;
