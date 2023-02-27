import io from 'socket.io-client';
// import axios from 'axios';
import { store } from 'state/store';
import { setGameRooms } from './appReducer';
import { setState, setGameId } from './gameReducer';

const { REACT_APP_WS_URL } = process.env;
let socket = null;
// const { name, avatar } = store.getState().user;

export const connectServer = () => {
    if (!socket)
        socket = io.connect(REACT_APP_WS_URL, {
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });

    // const events = socket.eventNames();
    // console.log('Сокет подписан на события: ', events);

    socket.on('connect', () => {
        console.log('Connect! Socket.id = ', socket.id);
        // const events = [...Object.keys(socket._callbacks)];
        loadGameRooms();
        // console.log('events: ', events);
    });

    socket.on('disconnect', () => {
        console.log('disconnecting :(((');
        // socket.removeAllListeners();
    });

    socket.on('reconnect', () => {
        console.log('reconnect');
    });

    socket.on('error', err => {
        console.log('error ? ');
        console.log('err: ', err);
    });

    socket.on('connect_error', err => {
        console.log('connect_error ? ');
        console.log('err: ', err);
    });
};

export const loadGameRooms = () => {
    // console.log(' loadGameRooms socket= ', socket);
    if (!socket) return;
    socket.on('updateGameRooms', gameRooms => {
        console.log('updateGameRooms');
        store.dispatch(setGameRooms(gameRooms));
    });
};

export const exitGameRoom = () => {
    if (socket) {
        console.log('exitGameRoom  id= ', socket.id);
        const { name, avatar } = store.getState().user;
        const gameId = store.getState().game.id;
        socket.emit('exitGameRoom', { gameId, name, avatar });
        socket.off('joinGame');

        store.dispatch(setGameId(null));
    }
};

export const createGameRoom = () => {
    const { name, avatar } = store.getState().user;
    socket.on('joinGame', createGame);
    socket.emit('createGame', { name, avatar });
};

// export const addPlayer = gameId => {
//     console.log('addPlayer  id= ', socket.id);

//     socket.emit('addPlayer', { gameId, name, avatar });
//     // store.dispatch(setGameId(gameId));
// };

export const joinGameRoom = gameId => {
    console.log('joinGameRoom', gameId);
    socket.emit('joinGameRoom', { gameId }, gameId => {
        console.log('response', gameId);
        socket.on('joinGame', createGame);
        const { name, avatar } = store.getState().user;
        const players = store.getState().game.players;
        if (!players.find(player => player.name === name)) {
            socket.emit('addPlayer', { gameId, name, avatar });
        }
        store.dispatch(setGameId(gameId));
    });
};

export const findPlayers = () => {
    const gameId = store.getState().game.id;
    socket.emit('findPlayers', gameId);
};

function createGame(game) {
    console.log('CREATE game: ', game);

    store.dispatch(setState({ players: game.players, gameId: game._id }));

    // store.dispatch(setGameId(game._id));
    // store.dispatch(setGameId(game._id));
}
