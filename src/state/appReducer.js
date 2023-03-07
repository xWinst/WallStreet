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

        setCurrentPlayer: (state, action) => {
            console.log('action setCurrentPlayer: ', action.payload);
            const { gameId, player } = action.payload;
            const index = state.gameRooms.findIndex(
                room => room._id === gameId
            );
            console.log('gameId: ', gameId);
            console.log('index: ', index);
            state.gameRooms[index].currentPlayer = player;
        },
    },
});

export const { setGameRooms, setCurrentPlayer } = appSlice.actions;

export default appSlice.reducer;
