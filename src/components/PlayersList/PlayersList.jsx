import { useSelector } from 'react-redux';
import { UserInfo, Select } from 'components';
// import { setPlayers } from 'state/gameReducer';
import { getName } from 'db';
import { ai } from 'images';
import s from './PlayersList.module.css';
import { setFirstPlayer, addAiPlayer } from 'state/gameOperation';

const PlayersList = ({ room }) => {
    const user = useSelector(state => state.user.name);

    // const dispatch = useDispatch();
    const { players, owner, maxPlayers, currentPlayer, _id } = room;
    const isOwner = user === owner;

    const changeFirstPlayer = value => {
        if (value !== currentPlayer) setFirstPlayer(value);
    };

    const addPlayer = () => {
        if (players.length >= maxPlayers) return;
        const player = {
            name: getName(players),
            avatar: ai,
            type: 'ai',
        };
        addAiPlayer(_id, player);
    };

    return (
        <>
            <ul className={s.list}>
                {Array(maxPlayers)
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

            <div className={s.params}>
                <p>Первый ход: </p>
                {isOwner ? (
                    <Select
                        list={players.map(({ name }) => name)}
                        onSelect={changeFirstPlayer}
                        value={currentPlayer}
                        name="playerTurn"
                    />
                ) : (
                    <p>{currentPlayer}</p>
                )}
            </div>
        </>
    );
};

export default PlayersList;
