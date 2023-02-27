// import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserInfo } from 'components';
import { setPlayers } from 'state/gameReducer';
// import { setName } from 'state/userReducer';
import { getName } from 'db';
import { ai } from 'images';
import s from './PlayersList.module.css';

const PlayersList = () => {
    const playersList = useSelector(state => state.game.players);
    // const [editId, setEditId] = useState(null);

    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(
    //         setPlayers([
    //             { name, avatar },
    //             { name: getName([name]), avatar: ai },
    //         ])
    //     );
    // }, [name, dispatch]);

    const addPlayer = () => {
        if (playersList.length >= 4) return;
        dispatch(
            setPlayers([
                ...playersList,
                {
                    name: getName(playersList),
                    avatar: ai,
                },
            ])
        );
    };

    // const removePlayer = i => {
    //     dispatch(setPlayers(playersList.filter((_, idx) => idx !== i)));
    // };

    // const cancel = () => {
    //     setEditId(null);
    // };

    // const submit = name => {
    //     dispatch(updatePlayer({ index: editId, name }));
    //     dispatch(setName(name));
    //     // setEditId(null);
    // };

    return (
        <ul className={s.list}>
            {playersList.map(({ name, avatar }, i) => (
                <li key={name + i}>
                    {name ? (
                        <UserInfo userName={name} userAvatar={avatar} />
                    ) : (
                        <div className={s.flexBox}>
                            <p className={s.slot}>Свободное место</p>
                            <p className={s.btn} onClick={addPlayer}>
                                Вставить ИИ игрока
                            </p>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default PlayersList;
