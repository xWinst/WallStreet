import { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, UserInfo, Modal } from 'components';
import { joinGameRoom } from 'state/gameOperation';
// import { setGameId } from 'state/gameReducer';
import s from './GameRoom.module.css';

const GameRoom = ({ room, user }) => {
    // console.log('room: ', room);
    const [isExpanded, setIsExpanded] = useState();
    const [gameId, setGameId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false);
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    // const dispatch = useDispatch();

    useEffect(() => {
        console.log('go222?');
        console.log('gameId: ', gameId);
        if (gameId) navigate(`/game/${gameId}`);
    }, [gameId, navigate]);

    const toggleExpand = () => {
        setIsExpanded(state => !state);
    };

    const response = gameId => {
        if (gameId) setGameId(gameId);
        else {
            setPassword('');
            setShowModal(false);
            setError(true);
        }
    };

    const joinGame = gameId => {
        console.log('join GAME click', gameId);
        joinGameRoom(gameId, password, response);
    };

    const tryJoinGame = gameId => {
        console.log('room.private: ', room.private);
        if (room.private) setShowModal(true);
        else joinGameRoom(gameId, password, response);
    };

    const getPossibleActions = () => {
        if (room.players.find(player => player.name === user))
            return (
                <Button
                    text="Войти"
                    onClick={() => {
                        console.log('enter GAME click', room._id);
                        setGameId(room._id);
                        console.log('go?');
                        // navigate('/gameLobby');
                    }}
                />
            );
        if (room.players.length === room.numberPlayers)
            return <p>Комната заполнена</p>;
        return (
            <Button
                text="Присоедениться"
                onClick={() => tryJoinGame(room._id)}
            />
        );
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
                    <p>{room.owner} Game</p>
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
                        <Button
                            text="Присоедениться"
                            onClick={() => joinGame(room._id)}
                        />
                        <Button text="Отмена" onClick={ok} />
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
                        <Button text="ok" onClick={ok} />
                    </div>
                </Modal>
            )}
        </li>
    );
};

export default GameRoom;
