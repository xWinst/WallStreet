import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const { REACT_APP_BASE_URL2 } = process.env;

axios.defaults.baseURL = REACT_APP_BASE_URL2;

export const setToken = token => {
    axios.defaults.headers.common.Authorization = token
        ? `Bearer ${token}`
        : '';
};

axios.interceptors.response.use(
    response => response,
    async error => {
        // console.log('response: ', response);
        // console.log('error: ', error);
        // console.log('????????');
        if (error.response.data.message === 'Not authorized') {
            console.log(
                'error.response.data.message: ',
                error.response.data.message
            );
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                const { data } = await axios.post('/users/refresh', {
                    refreshToken,
                });
                setToken(data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                error.config.headers.Authorization = `Bearer ${data.accessToken}`;

                return axios(error.config);
            } catch (error) {
                console.log('error: ', error);
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);
export const registration = createAsyncThunk(
    'register',
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            await axios.post('/users/register', credentials);
            dispatch(
                login({
                    name: credentials.name,
                    password: credentials.password,
                })
            );
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const login = createAsyncThunk(
    'login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/users/login', credentials);
            setToken(data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// export const logOut = createAsyncThunk(
//     'users/logout',
//     async (_, { rejectWithValue, dispatch }) => {
//         try {
//             await axios.get('/users/logout');
//             localStorage.setItem('refreshToken', null);
//             setToken(null);
//         } catch (error) {
//             return rejectWithValue(error);
//         }
//     }
// );

// export const getUser = createAsyncThunk(
//     'getUser',
//     async (_, { rejectWithValue }) => {
//         try {
//             const { data } = await axios.get('/users/user');
//             return data;
//         } catch (error) {
//             return rejectWithValue(error);
//         }
//     }
// );

export const refresh = createAsyncThunk(
    'users/refresh',
    async (_, thunkAPI) => {
        const { refreshToken, isLoggedIn } = thunkAPI.getState().user;

        if (refreshToken && !isLoggedIn) {
            try {
                const { data } = await axios.post('/users/refresh', {
                    refreshToken,
                });
                localStorage.setItem('refreshToken', data.refreshToken);
                setToken(data.accessToken);
                return data;
            } catch (error) {
                console.log('error: ', error);
                return thunkAPI.rejectWithValue(error.message);
            }
        }
        const { name, avatar } = thunkAPI.getState().user;
        return { refreshToken, user: { name, avatar } };
    }
);
