import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentPrice: [100, 100, 100, 100],
    futurePrice: [0, 0, 0, 0],
    currentCard: null,
    players: [],
    turn: 1,
    stage: 'before',
};

const gameSlice = createSlice({
    name: 'game',
    initialState,

    reducers: {
        setPlayers: (state, action) => {
            console.log('action addPlaer: ', action.payload);
            state.players = action.payload;
        },
        setCurrentCard: (state, action) => {
            // console.log('action: setCurrentCard', action);
            state.currentCard = action.payload;
        },
        setCurrentPrice: (state, action) => {
            console.log('action: setCurrentPrice', action);
            state.currentPrice = action.payload;
        },
        setFuturePrice: (state, action) => {
            // console.log('action: setFuturePrice', action);
            state.futurePrice = action.payload;
        },
        setStage: (state, action) => {
            // console.log('action: setGameState', action);
            state.stage = action.payload;
        },
        nextTurn: (state, action) => {
            state.turn++;
            state.stage = 'before';
        },
        updatePlayer: (state, actions) => {
            const { index, ...rest } = actions.payload;
            console.log('updatePlayer: ', rest);
            // console.log('actions.payload: ', actions.payload);
            state.players[index] = { ...state.players[index], ...rest };
        },

        setState: (state, action) => {
            return { ...state, ...action.payload };
        },
        reset: () => initialState,
    },
});

export const {
    setPlayers,
    setCurrentCard,
    setCurrentPrice,
    setFuturePrice,
    setStage,
    nextTurn,
    updatePlayer,
    reset,
    setState,
} = gameSlice.actions;

export default gameSlice.reducer;
