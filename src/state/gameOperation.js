import io from 'socket.io-client';
import { store } from 'state/store';
import { setGameRooms } from './appReducer';
import { setState, setGameId, setCurrentPlayer } from './gameReducer';
// import { setCurrentPlayer } from './appReducer';

const { REACT_APP_WS_URL } = process.env;
let socket = null;

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
        console.log('Connect! Socket.id = ', socket.id); ////////////////
        loadGameRooms();
    });

    socket.on('disconnect', () => {
        console.log('disconnecting :(((');
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
    socket.on('updateGameRooms', gameRooms => {
        console.log('updateGameRooms');
        store.dispatch(setGameRooms(gameRooms));
        // const gameId = store.getState().game.id;
        // if (gameId) {
        //     const game = gameRooms.find(room => room._id === gameId);
        //     if (game) {
        //         store.dispatch(
        //             setState({
        //                 players: game.players,
        //                 numberPlayers: game.numberPlayers,
        //                 numberBigCards: game.numberBigCards,
        //                 numberSmallCards: game.numberSmallCards,
        //             })
        //         );
        //     } else store.dispatch(setGameId(null));
        // }
    });
};

export const exitGameRoom = (gameId, isOwner) => {
    console.log('exitGameRoom  id= ', socket.id);
    const name = store.getState().user.name;
    // const gameId = store.getState().game.id;
    socket.emit('exitGameRoom', { gameId, isOwner, name });

    store.dispatch(setGameId(null));
};

export const createGameRoom = settings => {
    const { name, avatar } = store.getState().user;
    socket.emit('createGame', { ...settings, name, avatar }, gameId => {
        store.dispatch(setState({ id: gameId })); //???
        settings.setGameId(gameId);
    });
    // socket.on('setFirstPlayer', player => {
    //     store.dispatch(setCurrentPlayerIdx(player));
    // });
};

export const joinGameRoom = (gameId, password, response) => {
    console.log('joinGameRoom', gameId);
    const { name, avatar } = store.getState().user;
    store.dispatch(setGameId(gameId)); ///???
    socket.emit('joinGameRoom', { gameId, password, name, avatar }, response);
};

export const findPlayers = () => {
    const gameId = store.getState().game.id;
    socket.emit('findPlayers', gameId);
};

export const setFirstPlayer = player => {
    console.log('setFirstPlayer', player);
    socket.emit('setFirstPlayer', player);
};

export const joinRoom = gameId => {
    console.log('joinRoom', gameId);
    socket.emit('joinRoom', gameId);
    const { currentPlayer } = getRoom(gameId);
    store.dispatch(setCurrentPlayer(currentPlayer));

    socket.on('setFirstPlayer', player => {
        console.log('a: setFirstPlayer: ', player);

        store.dispatch(setCurrentPlayer(player));
    });
};

const getRoom = gameId => {
    const rooms = store.getState().app.gameRooms;
    return rooms.find(room => room._id === gameId);
};
