import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    price: [100, 100, 100, 100],
    futurePrice: [0, 0, 0, 0],
    players: [],
    player: null,
    currentPlayer: null,
    turn: 1,
    lastTurn: null,
    turns: [],
    stage: 'before',
    id: null,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,

    reducers: {
        // setPlayers: (state, action) => {
        //     console.log('action addPlaer: ', action.payload);
        //     state.players = action.payload;
        // },
        // setCurrentPlayer: (state, action) => {
        //     console.log('action: setCurrentPlayerIdx', action);
        //     state.currentPlayer = action.payload;
        // },
        setCurrentPrice: (state, action) => {
            console.log('action: setCurrentPrice', action);
            state.price = action.payload;
        },
        setFuturePrice: (state, action) => {
            console.log('action: setFuturePrice', action);
            state.futurePrice = action.payload;
        },
        setStage: (state, action) => {
            // console.log('action: setGameState', action);
            state.stage = action.payload;
        },
        // nextTurn: (state, action) => {
        //     state.turn++;
        //     state.stage = 'before';
        // },

        updatePlayer: (state, action) => {
            console.log('updatePlayer: ', action);
            state.player = { ...state.player, ...action.payload };
            // const playerIdx = state.players.findIndex(
            //     ({ name }) => (name = state.player.name)
            // );
            // state.players[playerIdx] = {
            //     ...state.players[playerIdx],
            //     ...action.payload,
            // };
        },

        // nextPlayer: (state, action) => {
        //     state.currentPlayerIdx = action.payload;
        // },

        setState: (state, action) => {
            return { ...state, ...action.payload };
        },

        // setGameId: (state, action) => {
        //     state.id = action.payload;
        // },
        reset: () => initialState,
    },
});

export const {
    // setPlayers,
    setCurrentPrice,
    setFuturePrice,
    // setStage,
    // nextTurn,
    updatePlayer,
    reset,
    setState,
    // setGameId,
    // setCurrentPlayer,
} = gameSlice.actions;

export default gameSlice.reducer;
