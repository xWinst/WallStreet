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
    showTurn: null,
    results: null,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,

    reducers: {
        // setPlayers: (state, action) => {
        //     console.log('action setPlayers: ', action.payload);
        //     state.players = action.payload;
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

        updatePlayer: (state, action) => {
            console.log('updatePlayer: ', action);
            state.player = { ...state.player, ...action.payload };
        },

        setState: (state, action) => {
            return { ...state, ...action.payload };
        },

        setShowTurn: (state, action) => {
            console.log('action setIsNew: ', action.payload);
            state.showTurn = action.payload;
        },

        synchronization: state => {
            const index = state.players.findIndex(
                ({ name }) => name === state.currentPlayer
            );
            state.players[index] = {
                ...state.players[index],
                money: state.player.money,
                shares: state.player.shares,
                bigDeck: state.player.bigDeck,
                smallDeck: state.player.smallDeck,
            };
        },

        setResults: state => {
            const players = state.players.map(
                ({ avatar, name, shares, money }) => {
                    const capital = shares.reduce(
                        (total, count, i) => total + count * state.price[i],
                        money
                    );
                    return { avatar, name, capital };
                }
            );
            players.sort((a, b) => b.capital - a.capital);
            state.results = players;
        },

        reset: () => initialState,
    },
});

export const {
    setCurrentPrice,
    setFuturePrice,
    updatePlayer,
    setState,
    setShowTurn,
    synchronization,
    setResults,
    reset,
} = gameSlice.actions;

export default gameSlice.reducer;
