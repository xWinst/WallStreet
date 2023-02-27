import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    gameRooms: [],
};

const appSlice = createSlice({
    name: 'app',
    initialState,

    reducers: {
        setGameRooms: (state, action) => {
            console.log('action setGameRooms: ', action.payload);
            state.gameRooms = action.payload;
        },
    },
});

export const { setGameRooms } = appSlice.actions;

export default appSlice.reducer;
