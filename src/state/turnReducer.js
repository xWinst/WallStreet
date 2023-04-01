import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentTurn: 1,
    player: null,
    stageBefore: {
        sales: [0, 0, 0, 0],
        purchases: [0, 0, 0, 0],
        startShares: null,
        shares: null,
        price: [],
        money: 0,
    },
    stageAfter: {
        sales: [0, 0, 0, 0],
        purchases: [0, 0, 0, 0],
        shares: null,
        price: [],
    },
    card: {
        id: null,
        colorUp: null,
        colorDown: [],
    },
    bonuses: [0, 0, 0, 0],
    fines: [0, 0, 0, 0],
    compensations: [0, 0, 0, 0],
};

const turnSlice = createSlice({
    name: 'turn',
    initialState,

    reducers: {
        setStageBefore: (state, action) => {
            console.log('action setStageBefore: ', action.payload);
            state.stageBefore = action.payload.stageBefore;
            state.card = action.payload.card;
            state.bonuses = action.payload.bonus;
            state.fines = action.payload.fine;
            state.compensations = action.payload.compensation;
            state.player = action.payload.player;
            state.currentTurn = action.payload.turn;
        },

        setStageAfter: (state, action) => {
            console.log('action setStageAfter: ', action.payload);
            state.stageAfter = action.payload;
        },

        // setTurn: (state, action) => {
        //     console.log('action setNewTurn: ', action.payload);
        //     return { ...state, ...action.payload, isNew: true };
        // },

        // setShowTurn: (state, action) => {
        //     console.log('action setIsNew: ', action.payload);
        //     state.showTurn = action.payload;
        // },

        // reset: () => initialState,
    },
});

export const { setStageBefore, setStageAfter } = turnSlice.actions;

export default turnSlice.reducer;
