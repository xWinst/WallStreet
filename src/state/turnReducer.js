import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stageBefore: {
        sales: [0, 0, 0, 0],
        purchases: [0, 0, 0, 0],
        shares: null,
    },
    stageAfter: {
        sales: [0, 0, 0, 0],
        purchases: [0, 0, 0, 0],
        shares: null,
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
            state.stageBefore = action.payload;
        },

        setStageAfter: (state, action) => {
            console.log('action setStageAfter: ', action.payload);
            state.stageAfter = { ...state.stageAfter, ...action.payload };
        },

        setCard: (state, action) => {
            console.log('action setCard: ', action.payload);
            state.card = action.payload;
        },

        setBonuses: (state, action) => {
            console.log('action setBonuses: ', action.payload);
            state.bonuses = action.payload.bonus;
            state.fines = action.payload.fine;
            state.compensations = action.payload.compensation;
        },

        reset: () => initialState,
    },
});

export const { setStageBefore, setStageAfter, setBonuses, setCard, reset } =
    turnSlice.actions;

export default turnSlice.reducer;
