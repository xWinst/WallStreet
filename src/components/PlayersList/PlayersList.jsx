import { useSelector, useDispatch } from 'react-redux';
import { UserInfo, Select } from 'components';
import { setPlayers, setCurrentPlayer } from 'state/gameReducer';
import { getName } from 'db';
import { ai } from 'images';
import s from './PlayersList.module.css';
import { setFirstPlayer } from 'state/gameOperation';

const PlayersList = ({ room }) => {
    const currentPlayer = useSelector(state => state.game.currentPlayer);
    const user = useSelector(state => state.user.name);
    // const rooms = useSelector(state => state.app.gameRooms);

    const dispatch = useDispatch();

    // joinRoom(gameId);

    const { players, owner, numberPlayers } = room;

    const isOwner = user === owner;

    const changeFirstPlayer = value => {
        dispatch(
            // setCurrentPlayerIdx(players.findIndex(({ name }) => name === value))
            setCurrentPlayer(value)
        );
        setFirstPlayer(value);
    };

    const addPlayer = () => {
        if (players.length >= 4) return;
        dispatch(
            setPlayers([
                ...players,
                {
                    name: getName(players),
                    avatar: ai,
                },
            ])
        );
    };

    // const removePlayer = i => {
    //     dispatch(setPlayers(players.filter((_, idx) => idx !== i)));
    // };

    // const cancel = () => {
    //     setEditId(null);
    // };

    // const submit = name => {
    //     dispatch(updatePlayer({ index: editId, name }));
    //     dispatch(setName(name));
    //     // setEditId(null);
    // };
    // console.log('players: ', players);

    const x = Array(numberPlayers).map((_, i) => {
        console.log('i= ', i);
        return i;
    });

    console.log('x: ', x);
    return (
        <>
            <ul className={s.list}>
                {Array(numberPlayers)
                    .fill(0)
                    .map((_, i) => (
                        <li key={i}>
                            {players[i] ? (
                                <UserInfo
                                    userName={players[i].name}
                                    userAvatar={players[i].avatar}
                                />
                            ) : (
                                <div className={s.flexBox}>
                                    <p className={s.slot}>Свободное место</p>
                                    {isOwner && (
                                        <p
                                            className={s.btn}
                                            onClick={addPlayer}
                                        >
                                            Вставить ИИ игрока
                                        </p>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
            </ul>
            {numberPlayers === players.length && (
                <div className={s.params}>
                    <p>Первый ход: </p>
                    {isOwner ? (
                        <Select
                            list={players.map(({ name }) => name)}
                            onSelect={changeFirstPlayer}
                            // value={players[currentPlayerIdx].name}
                            value={currentPlayer}
                            name="playerTurn"
                        />
                    ) : (
                        // <p>{players[currentPlayerIdx].name}</p>
                        <p>{currentPlayer}</p>
                    )}
                </div>
            )}
        </>
    );
};

export default PlayersList;
