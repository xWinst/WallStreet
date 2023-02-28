import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    price: [100, 100, 100, 100],
    futurePrice: [0, 0, 0, 0],
    // currentCard: null,
    numberPlayers: 2,
    players: [],
    currentPlayerIdx: 0,
    turn: 1,
    stage: 'before',
    player: 'Anonymus',
    status: 'creating',
    id: null,
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
            // console.log('action: setFuturePrice', action);
            state.futurePrice = action.payload;
        },
        // setStage: (state, action) => {
        //     // console.log('action: setGameState', action);
        //     state.stage = action.payload;
        // },
        nextTurn: (state, action) => {
            state.turn++;
            state.stage = 'before';
        },

        updatePlayer: (state, action) => {
            const { index = state.currentPlayerIdx, ...rest } = action.payload;
            console.log('updatePlayer: ', rest);
            // console.log('actions.payload: ', actions.payload);
            state.players[index] = { ...state.players[index], ...rest };
        },

        nextPlayer: (state, action) => {
            state.currentPlayerIdx = action.payload;
        },

        setState: (state, action) => {
            return { ...state, ...action.payload };
        },

        setGameId: (state, action) => {
            state.id = action.payload;
        },
        reset: () => initialState,
    },
});

export const {
    setPlayers,
    setCurrentCard,
    setCurrentPrice,
    setFuturePrice,
    // setStage,
    nextTurn,
    updatePlayer,
    reset,
    setState,
    setGameId,
} = gameSlice.actions;

export default gameSlice.reducer;
