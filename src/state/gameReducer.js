import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentPrice: [100, 100, 100, 100],
    futurePrice: [0, 0, 0, 0],
    currentCard: null,
    players: [],
    gameState: 'before',
    turn: 1,
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
            console.log('action: setCurrentCard', action);
            state.currentCard = action.payload;
        },
        setCurrentPrice: (state, action) => {
            console.log('action: setCurrentPrice', action);
            state.currentPrice = action.payload;
        },
        setFuturePrice: (state, action) => {
            console.log('action: setFuturePrice', action);
            state.futurePrice = action.payload;
        },
        setGameState: (state, action) => {
            console.log('action: setGameState', action);
            state.gameState = action.payload;
        },
        nextTurn: (state, action) => {
            state.turn++;
            state.gameState = 'before';
        },
        updatePlayer: (state, actions) => {
            const { index, props } = actions.payload;
            console.log('actions.payload: ', actions.payload);
            state.players[index] = { ...state.players[index], ...props };
        },
    },
});

export const {
    setPlayers,
    setCurrentCard,
    setCurrentPrice,
    setFuturePrice,
    setGameState,
    nextTurn,
    updatePlayer,
} = gameSlice.actions;

export default gameSlice.reducer;
