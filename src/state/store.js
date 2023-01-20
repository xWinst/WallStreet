import { configureStore, combineReducers } from '@reduxjs/toolkit';
import game from './gameReducer';

const rootReducer = combineReducers({
    game,
});

export const store = configureStore({
    reducer: rootReducer,
});

// export default store;
