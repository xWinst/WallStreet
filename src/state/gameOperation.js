import io from 'socket.io-client';
import { store } from 'state/store';
import { setRooms, updateRoom, setGames } from './appReducer';
import { setState } from './gameReducer';
// import { setCurrentPlayer } from './appReducer';

const { REACT_APP_WS_URL } = process.env;
let socket = null;
// let count = 0;

export const connectServer = () => {
    if (!socket)
        socket = io.connect(REACT_APP_WS_URL, {
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });

    // const events = socket.eventNames();
    // console.log('Сокет подписан на события: ', socket.eventNames());

    socket.on('connect', () => {
        console.log('Connect! Socket.id = ', socket.id); ////////////////
        const name = store.getState().user.name;
        socket.emit('setUsername', name);
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

    socket.on('updateRoom', room => {
        console.log('a: updateRoom ', room);
        store.dispatch(updateRoom(room));
    });

    socket.on('setGame', game => {
        console.log('a: updateGame: ', game);
        game = getProcessedData(game);
        store.dispatch(setState(game));
    });
};

export const loadGameRooms = () => {
    socket.on('updateGameRooms', rooms => {
        console.log('updateGameRooms');
        store.dispatch(setRooms(rooms));
    });

    socket.on('updateActiveGames', games => {
        console.log('updateActiveGames');
        games = games.map(game => getProcessedData(game));
        store.dispatch(setGames(games));
    });
};

export const exitGameRoom = (gameId, isOwner) => {
    console.log('exitGameRoom  id= ', socket.id);
    const name = store.getState().user.name;
    // const gameId = store.getState().game.id;
    socket.emit('exitGameRoom', { gameId, isOwner, name });

    // store.dispatch(setGameId(null));
};

export const createGameRoom = (params, toLobby) => {
    const { name, avatar } = store.getState().user;
    const player = { name, avatar };
    socket.emit('createGame', { ...params, player }, toLobby);
};

export const joinGameRoom = (gameId, password, joinRoom, isIncluded) => {
    console.log('joinRoom', gameId);
    const { name, avatar } = store.getState().user;
    const player = { name, avatar };
    socket.emit('joinRoom', { gameId, password, player, isIncluded }, joinRoom);
};

export const loadActiveGame = gameId => {
    const games = store.getState().app.games;
    const game = games.find(({ id }) => id === gameId);
    store.dispatch(setState(game));
    // socket.emit('loadActiveGame', gameId);
};

export const setFirstPlayer = player => {
    console.log('setFirstPlayer', player);
    socket.emit('setFirstPlayer', player);
};

export const startGame = gameId => {
    console.log('startGame', gameId);
    socket.emit('startGame', gameId);
};

function getProcessedData(game) {
    const players = game.players.map(
        ({ name, avatar, money, shares, bigDeck, smallDeck }) => ({
            name,
            avatar,
            money,
            shares,
            numberBigCards: bigDeck.length,
            numberSmallCards: smallDeck.length,
        })
    );

    const { name } = store.getState().user;
    const player = { ...game.players.find(player => player.name === name) };
    const { price, currentPlayer, turn, lastTurn, _id: id } = game;
    player.isTurn = currentPlayer === name;
    player.frezenShares = [0, 0, 0, 0];
    // player.freeShares = player.shares;
    player.numberBigCards = player.bigDeck.length;
    player.numberSmallCards = player.smallDeck.length;

    const result = {
        price,
        futurePrice: price,
        players,
        player,
        currentPlayer,
        turn,
        lastTurn,
        stage: 'before',
        id,
    };

    return result;
}
