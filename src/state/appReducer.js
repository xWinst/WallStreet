import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rooms: [],
    games: [],
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

        setGames: (state, action) => {
            console.log('action setGames: ', action.payload);
            state.games = action.payload;
        },
    },
});

export const { setRooms, updateRoom, setGames } = appSlice.actions;

export default appSlice.reducer;
