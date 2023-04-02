import { useState } from 'react';
// import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, UserInfo, Modal } from 'components';
import { joinGameRoom } from 'state/gameOperation';
// import { setState } from 'state/gameReducer';

import s from './GameRoom.module.css';

const GameRoom = ({ room, user }) => {
    // console.log('room: ', room);
    const [isExpanded, setIsExpanded] = useState();
    // const [roomId, setGameId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false);
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     if (gameId) navigate(`/game/${gameId}`);
    // }, [gameId, navigate]);

    const toggleExpand = () => {
        setIsExpanded(state => !state);
    };

    const joinGame = roomId => {
        if (roomId) navigate(`/game/${roomId}`);
        else {
            setPassword('');
            setShowModal(false);
            setError(true);
        }
    };

    const joinRoom = () => {
        console.log('join GAME click', room._id);
        joinGameRoom(room._id, password, joinGame, true);
    };

    const tryJoinRoom = () => {
        console.log('room.private: ', room.private);
        if (room.private) setShowModal(true);
        else joinGameRoom(room._id, password, joinGame, false);
    };

    const getPossibleActions = () => {
        if (room.players.find(player => player.name === user))
            return <Button text="Войти" click={joinRoom} />;
        if (room.players.length === room.maxPlayers)
            return <p>Комната заполнена</p>;
        return <Button text="Присоедениться" click={tryJoinRoom} />;
    };

    const ok = () => {
        setShowModal(false);
        setError(null);
    };

    return (
        <li className={s.item}>
            <div className={s.btn} onClick={toggleExpand}>
                <div className={s.gameName}>
                    {room.private && <Icon icon="lock" w={24} />}
                    <p>
                        Game: <span>{room.name || room._id}</span>
                    </p>
                </div>
                <Icon icon={isExpanded ? 'collaps' : 'expand'} w={20} />
            </div>
            {isExpanded && (
                <>
                    <ul className={s.players}>
                        Игроки:
                        {room.players.map(({ name, avatar }) => (
                            <li key={name}>
                                <UserInfo userName={name} userAvatar={avatar} />
                            </li>
                        ))}
                    </ul>
                    {getPossibleActions()}
                </>
            )}
            {showModal && (
                <Modal onClose={ok} style={{ maxWidth: 400 }}>
                    <div className={s.modal}>
                        <p>
                            Для входа в приватную комнату, Вам нужно знать
                            пароль
                        </p>
                        <input
                            className={s.password}
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                        />
                        <Button text="Присоедениться" click={joinRoom} />
                        <Button text="Отмена" click={ok} />
                    </div>
                </Modal>
            )}
            {error && (
                <Modal onClose={ok} style={{ maxWidth: 400 }}>
                    <div className={s.modal}>
                        <p>
                            Не удалось подключиться к игре. Проверьте
                            правильность введеного пароля если он требуется или
                            повторите попытку.
                        </p>
                        <Button text="ok" click={ok} cn={s.center} />
                    </div>
                </Modal>
            )}
        </li>
    );
};

export default GameRoom;
