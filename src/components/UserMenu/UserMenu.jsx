import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, GameRoom } from 'components';
import s from './UserMenu.module.css';
// import { setPlayers } from 'state/gameReducer';

const UserMenu = () => {
    const gameRooms = useSelector(state => state.app.gameRooms);
    const name = useSelector(state => state.user.name);
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const createRoom = () => {
        // dispatch(setPlayers([name, avatar]));
        navigate(`/createGame`);
    };

    return (
        <div className={s.container}>
            {gameRooms.length > 0 ? (
                <ul className={s.gameRoomsBox}>
                    {gameRooms.map(room => (
                        <GameRoom key={room._id} room={room} user={name} />
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
