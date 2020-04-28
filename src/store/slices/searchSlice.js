import * as RTK from '@reduxjs/toolkit';

const searchSlice = RTK.createSlice({
    name: 'lastSearchValue',
    initialState: '',
    reducers: {
        updateLastSearchValue: (state, {payload}) => {
            return payload;
        }
    }
});

export const { updateLastSearchValue } = searchSlice.actions;

export default searchSlice.reducer;
