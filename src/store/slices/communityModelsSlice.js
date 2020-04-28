import * as RTK from '@reduxjs/toolkit';

const communityModelsSlice = RTK.createSlice({
    name: 'communityModels',
    initialState: [],
    reducers: {
        updateCommunityModels: (state, {payload}) => state.splice().concat(payload),
    }
});

export const { updateCommunityModels } = communityModelsSlice.actions;

export default communityModelsSlice.reducer;
