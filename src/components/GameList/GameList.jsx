import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, GameRoom, ActiveGame } from 'components';
import s from './GameList.module.css';
// import { setPlayers } from 'state/gameReducer';

const GameList = () => {
    const { rooms, games } = useSelector(state => state.app);
    const name = useSelector(state => state.user.name);
    const navigate = useNavigate();

    const createRoom = () => {
        navigate(`/createGame`);
    };

    return (
        <div className={s.container}>
            <p className={s.title}>Зал ожиданий</p>
            {rooms.length > 0 ? (
                <ul className={s.gameRoomsBox}>
                    {rooms.map(room => (
                        <GameRoom key={room._id} room={room} user={name} />
                    ))}
                </ul>
            ) : (
                <p className={s.message}>Зал ожиданий пока пуст &#128577;</p>
            )}

            <Button cn={s.btn} text="Создать игру" click={createRoom} />

            <p className={s.title}>Действующие Игры</p>
            {games.length > 0 ? (
                <ul className={s.gameRoomsBox}>
                    {games.map(game => (
                        <ActiveGame key={game.id} game={game} />
                    ))}
                </ul>
            ) : (
                <p className={s.message}>Игр с Вашим участием не найдено</p>
            )}
        </div>
    );
};

export default GameList;
