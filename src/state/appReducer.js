import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rooms: [],
};

const appSlice = createSlice({
    name: 'app',
    initialState,

    reducers: {
        setRooms: (state, action) => {
            console.log('action setGameRooms: ', action.payload);
            state.rooms = action.payload;
        },

        updateRoom: (state, action) => {
            console.log('action updateRoom: ', action.payload);
            const room = action.payload;
            const index = state.rooms.findIndex(({ _id }) => _id === room._id);
            state.rooms[index] = room;
        },
    },
});

export const { setRooms, updateRoom } = appSlice.actions;

export default appSlice.reducer;
