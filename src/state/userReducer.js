import { createSlice } from '@reduxjs/toolkit';
import message from 'helpers/Message';
import { registration, login, refresh } from './userOperations';

const initialState = {
    name: null,
    avatar: null,
    // accessToken: null,
    refreshToken: null,
    isLoading: true, //Так надо! Иначе при перезагрузке выкидывает только на определенную страницу
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,

    reducers: {
        setName: (state, action) => {
            console.log('action setName: ', action.payload);
            state.name = action.payload;
        },

        setUser: (state, action) => {
            state.name = action.payload.user.name;
            state.avatar = action.payload.user.avatarUrl;
            // state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isLoggedIn = true;
            state.isLoading = false;
        },
    },

    extraReducers: builder => {
        builder
            .addCase(registration.pending, state => {
                state.isLoading = true;
            })
            // .addCase(registration.fulfilled, state => {
            //     state.isLoading = false;
            // })
            .addCase(registration.rejected, (state, action) => {
                state.isLoading = false;
                message.error(
                    'Ошибка регистрации',
                    `${action.payload.response.data.message}`,
                    'Ok'
                );
            })
            .addCase(login.pending, state => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                console.log('action.payload: ', action.payload);
                state.isLoading = false;
                state.isLoggedIn = true;
                // state.id = action.payload.user.id;
                state.name = action.payload.user.name;
                state.avatar = action.payload.user.avatar;
                // state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                message.error(
                    'Ошибка входа',
                    `${action.payload.response.data.message}`,
                    'Ok'
                );
            })
            .addCase(refresh.pending, state => {
                state.isLoading = true;
            })
            .addCase(refresh.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = !!action.payload.user.name;
                // state.id = action.payload.user.id;
                state.name = action.payload.user.name;
                state.avatar = action.payload.user.avatar;
                // state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(refresh.rejected, (state, action) => {
                console.log('action: ', action);
                state.isLoading = false;
                message.error('Ошибка входа', `${action.payload}`, 'Ok');
            });
    },
});

export const { setName, setUser } = userSlice.actions;

export default userSlice.reducer;
