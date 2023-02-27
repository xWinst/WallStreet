import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, GameRoom } from 'components';
import { createGameRoom } from 'state/gameOperation';
import s from './UserMenu.module.css';

const UserMenu = () => {
    const gameId = useSelector(state => state.game.id);
    const gameRooms = useSelector(state => state.app.gameRooms);
    const navigate = useNavigate();

    useEffect(() => {
        if (gameId) navigate(`/createGame`);
    }, [gameId, navigate]);

    const createRoom = () => {
        createGameRoom();
    };

    return (
        <div className={s.container}>
            {gameRooms.length > 0 ? (
                <ul className={s.gameRoomsBox}>
                    {gameRooms.map(room => (
                        <GameRoom key={room._id} room={room} />
                    ))}
                </ul>
            ) : (
                <p className={s.message}>Зал ожиданий пока пуст &#128577;</p>
            )}

            <div className={s.menu}>
                {/* <p className={s.title}>Wall Street</p> */}
                <Button cn={s.btn} text="Создать игру" onClick={createRoom} />
                {/* <Button cn={s.btn} text="Присоедениться к игре" /> */}
                {/* <Button cn={s.btn} text="Настройки аккаунта" /> */}
                {/* <Button cn={s.btn} text="Статистика" /> */}
                {/* <Button cn={s.btn} text="Правила игры" /> */}
            </div>
        </div>
    );
};

export default UserMenu;
