import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import game from './gameReducer';
import user from './userReducer';
import app from './appReducer';

const persistConfig = {
    key: 'user',
    storage,
    whitelist: ['refreshToken'],
};

const rootReducer = combineReducers({
    // game: persistReducer({ key: 'game', storage }, game),
    app,
    game,
    user: persistReducer(persistConfig, user),
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
                ignoredActionPaths: ['payload'],
            },
        }),
});

export const persistor = persistStore(store);

// export default store;
